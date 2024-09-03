import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { GlobalNetworkSubnetEdit, GlobalNetworkSubnetVO } from '../../../../../@core/data/global-network';
import { GlobalNetworkService } from '../../../../../@core/services/global-network.service';

@Component({
  selector: 'app-global-network-subnet-editor',
  templateUrl: './global-network-subnet-editor.component.html',
  styleUrls: [ './global-network-subnet-editor.component.less' ],
})
export class GlobalNetworkSubnetEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: GlobalNetworkSubnetVO;
  fromAssetId: number;
  operationType: boolean;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    certificateId: { validators: [ { required: true } ] },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private globalNetworkService: GlobalNetworkService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.fromAssetId = this.data['fromAssetId'];
  }

  addForm() {
    const param: GlobalNetworkSubnetEdit = {
      ...this.formData,
      fromAssetId: this.fromAssetId,
    };
    return this.globalNetworkService.addGlobalNetworkSubnet(param);
  }

  updateForm() {
    const param: GlobalNetworkSubnetEdit = {
      ...this.formData,
    };
    return this.globalNetworkService.updateGlobalNetworkSubnet(param);
  }

}
