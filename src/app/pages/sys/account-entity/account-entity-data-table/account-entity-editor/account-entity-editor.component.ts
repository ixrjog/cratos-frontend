import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui/form';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AccountEntityService } from '../../../../../@core/services/account-entity.service';

@Component({
  selector: 'app-account-entity-editor',
  templateUrl: './account-entity-editor.component.html',
  styleUrls: ['./account-entity-editor.component.less'],
})
export class AccountEntityEditorComponent implements OnInit {

  @ViewChild('editorForm') formDir: DFormGroupRuleDirective;
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: any;
  formGroup: FormGroup;
  operationType: boolean;

  entityTypeOptions = ['COMPANY', 'INDIVIDUAL'];

  constructor(private accountEntityService: AccountEntityService) {
  }

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.formGroup = new UntypedFormGroup({
      name: new UntypedFormControl(this.formData.name),
      entityType: new UntypedFormControl(this.formData.entityType),
      registeredName: new UntypedFormControl(this.formData.registeredName),
      country: new UntypedFormControl(this.formData.country),
      registrationNo: new UntypedFormControl(this.formData.registrationNo),
      contactPerson: new UntypedFormControl(this.formData.contactPerson),
      contactEmail: new UntypedFormControl(this.formData.contactEmail),
      contactPhone: new UntypedFormControl(this.formData.contactPhone),
      comment: new UntypedFormControl(this.formData.comment),
    });
  }

  addForm() {
    return this.accountEntityService.addAccountEntity(this.formGroup.value);
  }

  updateForm() {
    return this.accountEntityService.updateAccountEntity({ ...this.formGroup.value, id: this.formData.id });
  }

}
