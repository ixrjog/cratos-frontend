import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { DomainEdit, DomainVO } from '../../../../../@core/data/domian';
import { DomainService } from '../../../../../@core/services/domain.service';

@Component({
  selector: 'app-domain-editor',
  templateUrl: './domain-editor.component.html',
  styleUrls: [ './domain-editor.component.less' ],
})
export class DomainEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
@Input() data: any;
  formData: DomainVO;
  fromAssetId: number;
  operationType: boolean;

  domainTypeOptions = [
    'AWS_DOMAIN', 'ALIYUN_DOMAIN', 'CUSTOM_DOMAIN',
  ];

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    certificateId: { validators: [ { required: true } ] },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private domainService: DomainService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.fromAssetId = this.data['fromAssetId'];
  }

  addForm() {
    const param: DomainEdit = {
      ...this.formData,
      registrationTime: this.formData.registrationTime ? new Date(this.formData.registrationTime).getTime() : null,
      expiry: new Date(this.formData.expiry).getTime(),
      fromAssetId: this.fromAssetId,
    };
    return this.domainService.addDomain(param);
  }

  updateForm() {
    const param: DomainEdit = {
      ...this.formData,
      registrationTime: this.formData.registrationTime ? new Date(this.formData.registrationTime).getTime() : null,
      expiry: this.formData.expiry.getTime(),
    };
    return this.domainService.updateDomain(param);
  }

}
