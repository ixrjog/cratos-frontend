import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui/form';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DatacenterService } from '../../../../../@core/services/datacenter.service';
import { AccountEntityService } from '../../../../../@core/services/account-entity.service';
import { EdsService } from '../../../../../@core/services/ext-datasource.service.s';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-datacenter-network-editor',
  templateUrl: './datacenter-network-editor.component.html',
  styleUrls: ['./datacenter-network-editor.component.less'],
})
export class DatacenterNetworkEditorComponent implements OnInit {

  @ViewChild('editorForm') formDir: DFormGroupRuleDirective;
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: any;
  formGroup: FormGroup;
  operationType: boolean;
  selectedAccountEntity: any;

  datacenterTypeOptions = ['CLOUD', 'IDC', 'OFFICE'];
  edsTypeOptions = [];
  edsInstanceOptions = [];
  selectedEdsType: string = '';
  selectedEdsInstance: any;

  constructor(
    private datacenterService: DatacenterService,
    private accountEntityService: AccountEntityService,
    private edsService: EdsService,
  ) {
  }

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.formGroup = new UntypedFormGroup({
      name: new UntypedFormControl(this.formData.name),
      accountEntityId: new UntypedFormControl(this.formData.accountEntityId),
      datacenterType: new UntypedFormControl(this.formData.datacenterType),
      edsInstanceId: new UntypedFormControl(this.formData.edsInstanceId),
      valid: new UntypedFormControl(this.formData.valid),
      comment: new UntypedFormControl(this.formData.comment),
    });
    if (this.formData.accountEntity) {
      this.selectedAccountEntity = this.formData.accountEntity;
    }
    if (this.formData.edsInstance) {
      this.selectedEdsInstance = this.formData.edsInstance;
      this.selectedEdsType = this.formData.edsInstance.edsType;
    }
    this.loadEdsTypeOptions();
  }

  loadEdsTypeOptions() {
    this.edsService.getEdsInstanceTypeDatacenterOptions()
      .subscribe(({ body }) => {
        this.edsTypeOptions = body.options;
        if (!this.selectedEdsType && this.edsTypeOptions.length > 0) {
          this.selectedEdsType = this.edsTypeOptions[0].value;
        }
        if (this.selectedEdsType) {
          this.loadEdsInstances(this.selectedEdsType);
        }
      });
  }

  onEdsTypeChange(edsType: any) {
    this.selectedEdsType = edsType;
    this.loadEdsInstances(edsType);
  }

  loadEdsInstances(edsType: string) {
    this.edsService.queryEdsInstancePage({ edsType: edsType, queryName: '', page: 1, length: 50 })
      .subscribe(({ body }) => {
        this.edsInstanceOptions = body.data;
      });
  }

  onEdsInstanceChange(instance: any) {
    this.formGroup.patchValue({ edsInstanceId: instance?.id || null });
  }

  onSearchAccountEntity = (term: string) => {
    return this.accountEntityService.queryAccountEntityPage({ queryName: term, page: 1, length: 10 })
      .pipe(
        map(({ body }) =>
          body.data.map((entity, index) => ({ id: index, option: entity })),
        ),
      );
  };

  onAccountEntityChange(entity: any) {
    this.formGroup.patchValue({ accountEntityId: entity?.id || null });
  }

  addForm() {
    return this.datacenterService.addNetwork(this.formGroup.value);
  }

  updateForm() {
    return this.datacenterService.updateNetwork({ ...this.formGroup.value, id: this.formData.id });
  }

}
