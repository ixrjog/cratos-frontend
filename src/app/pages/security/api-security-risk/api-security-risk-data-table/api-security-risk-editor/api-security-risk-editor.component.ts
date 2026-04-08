import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui/form';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ApiSecurityRiskService } from '../../../../../@core/services/api-security-risk.service';
import { UserService } from '../../../../../@core/services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-api-security-risk-editor',
  templateUrl: './api-security-risk-editor.component.html',
  styleUrls: ['./api-security-risk-editor.component.less'],
})
export class ApiSecurityRiskEditorComponent implements OnInit {

  @ViewChild('editorForm') formDir: DFormGroupRuleDirective;
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: any;
  formGroup: FormGroup;
  operationType: boolean;

  riskLevelOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  progressOptions = ['PENDING', 'CONFIRMING', 'CONFIRMED', 'FIXED'];

  selectedAnalyst: any;
  selectedSecurityOfficer: any;
  selectedContactPerson: any;

  constructor(
    private apiSecurityRiskService: ApiSecurityRiskService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.formGroup = new UntypedFormGroup({
      riskNo: new UntypedFormControl(this.formData.riskNo),
      riskDescription: new UntypedFormControl(this.formData.riskDescription),
      apiEndpoint: new UntypedFormControl(this.formData.apiEndpoint),
      docUrl: new UntypedFormControl(this.formData.docUrl),
      riskLevel: new UntypedFormControl(this.formData.riskLevel),
      analyst: new UntypedFormControl(this.formData.analyst),
      securityOfficer: new UntypedFormControl(this.formData.securityOfficer),
      contactPerson: new UntypedFormControl(this.formData.contactPerson),
      followUpGroup: new UntypedFormControl(this.formData.followUpGroup),
      progress: new UntypedFormControl(this.formData.progress),
      analysisDesc: new UntypedFormControl(this.formData.analysisDesc),
      discoveredTime: new UntypedFormControl(this.formData.discoveredTime),
      expectedTime: new UntypedFormControl(this.formData.expectedTime),
      comment: new UntypedFormControl(this.formData.comment),
      completed: new UntypedFormControl(this.formData.completed),
    });
    if (this.formData.analystUser) {
      this.selectedAnalyst = this.formData.analystUser;
    }
    if (this.formData.securityOfficerUser) {
      this.selectedSecurityOfficer = this.formData.securityOfficerUser;
    }
    if (this.formData.contactPersonUser) {
      this.selectedContactPerson = this.formData.contactPersonUser;
    }
  }

  onSearchUser = (term: string) => {
    return this.userService.queryUserPage({ queryName: term, page: 1, length: 10 })
      .pipe(
        map(({ body }) =>
          body.data.map((user, index) => ({ id: index, option: user })),
        ),
      );
  };

  onAnalystChange(user: any) {
    this.formGroup.patchValue({ analyst: user?.username || '' });
  }

  onSecurityOfficerChange(user: any) {
    this.formGroup.patchValue({ securityOfficer: user?.username || '' });
  }

  onContactPersonChange(user: any) {
    this.formGroup.patchValue({ contactPerson: user?.username || '' });
  }

  onProgressChange(progress: string | number) {
    this.formGroup.patchValue({ progress });
    if (progress === 'CONFIRMED' || progress === 'FIXED') {
      this.formGroup.patchValue({ completed: true });
    }
  }

  addForm() {
    return this.apiSecurityRiskService.addRisk({
      ...this.formGroup.value,
      discoveredTime: this.formGroup.value.discoveredTime ? Date.parse(this.formGroup.value.discoveredTime.toString()) : null,
      expectedTime: this.formGroup.value.expectedTime ? Date.parse(this.formGroup.value.expectedTime.toString()) : null,
    });
  }

  updateForm() {
    return this.apiSecurityRiskService.updateRisk({
      ...this.formGroup.value,
      id: this.formData.id,
      discoveredTime: this.formGroup.value.discoveredTime ? Date.parse(this.formGroup.value.discoveredTime.toString()) : null,
      expectedTime: this.formGroup.value.expectedTime ? Date.parse(this.formGroup.value.expectedTime.toString()) : null,
    });
  }

}
