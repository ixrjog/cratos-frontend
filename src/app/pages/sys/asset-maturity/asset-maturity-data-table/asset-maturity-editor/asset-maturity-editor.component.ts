import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { AssetMaturityEdit, AssetMaturityVO } from '../../../../../@core/data/asset-maturity';
import { AssetMaturityService } from '../../../../../@core/services/asset-maturity.service';

@Component({
  selector: 'app-asset-maturity-editor',
  templateUrl: './asset-maturity-editor.component.html',
  styleUrls: ['./asset-maturity-editor.component.less']
})
export class AssetMaturityEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: AssetMaturityVO;
  operationType: boolean;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private assetMaturityService: AssetMaturityService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: AssetMaturityEdit = {
      ...this.formData,
      subscriptionTime: this.formData.subscriptionTime ? new Date(this.formData.subscriptionTime).getTime() : null,
      expiry: new Date(this.formData.expiry).getTime(),
    };
    return this.assetMaturityService.addAssetMaturity(param);
  }

  updateForm() {
    const param: AssetMaturityEdit = {
      ...this.formData,
      subscriptionTime: this.formData.subscriptionTime ? new Date(this.formData.subscriptionTime).getTime() : null,
      expiry:  new Date(this.formData.expiry).getTime(),
    };
    return this.assetMaturityService.updateAssetMaturity(param);
  }

}
