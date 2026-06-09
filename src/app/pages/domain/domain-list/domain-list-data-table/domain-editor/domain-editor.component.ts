import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { DomainEdit, DomainVO } from '../../../../../@core/data/domian';
import { DomainService } from '../../../../../@core/services/domain.service';
import { AccountEntityService } from '../../../../../@core/services/account-entity.service';
import { map } from 'rxjs/operators';

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
  selectedAccountEntity: any = null;

  domainTypeOptions = [
    'AWS_DOMAIN', 'ALIYUN_DOMAIN', 'CUSTOM_DOMAIN',
  ];

  onSearchAccountEntity = (term: string) => {
    return this.accountEntityService.queryAccountEntityPage({ queryName: term, page: 1, length: 20 })
      .pipe(
        map(({ body }) => body.data.map((item, index) => ({ id: index, option: item }))),
      );
  };

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    certificateId: { validators: [ { required: true } ] },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private domainService: DomainService, private accountEntityService: AccountEntityService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.fromAssetId = this.data['fromAssetId'];
    if (this.formData['accountEntity']) {
      this.selectedAccountEntity = this.formData['accountEntity'];
    }
  }

  onAccountEntityChange(entity: any) {
    this.formData['accountEntityId'] = entity?.id || null;
  }

  addForm() {
    const param: DomainEdit = {
      ...this.formData,
      accountEntityId: this.formData['accountEntityId'],
      registrationTime: this.formData.registrationTime ? new Date(this.formData.registrationTime).getTime() : null,
      expiry: new Date(this.formData.expiry).getTime(),
      fromAssetId: this.fromAssetId,
    };
    return this.domainService.addDomain(param);
  }

  updateForm() {
    const param: DomainEdit = {
      ...this.formData,
      accountEntityId: this.formData['accountEntityId'],
      registrationTime: this.formData.registrationTime ? new Date(this.formData.registrationTime).getTime() : null,
      expiry: this.formData.expiry.getTime(),
    };
    return this.domainService.updateDomain(param);
  }

}
