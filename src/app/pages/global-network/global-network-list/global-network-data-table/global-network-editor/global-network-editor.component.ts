import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { GlobalNetworkEdit, GlobalNetworkVO } from '../../../../../@core/data/global-network';
import { DValidateRules } from 'ng-devui';
import { GlobalNetworkService } from '../../../../../@core/services/global-network.service';

@Component({
  selector: 'app-global-network-editor',
  templateUrl: './global-network-editor.component.html',
  styleUrls: [ './global-network-editor.component.less' ],
})
export class GlobalNetworkEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: GlobalNetworkVO;
  operationType: boolean;
  globalNetworkList: GlobalNetworkVO[] = [];

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private globalNetworkService: GlobalNetworkService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: GlobalNetworkEdit = {
      ...this.formData,
    };
    return this.globalNetworkService.addGlobalNetwork(param);
  }

  updateForm() {
    const param: GlobalNetworkEdit = {
      ...this.formData,
    };
    return this.globalNetworkService.updateGlobalNetwork(param);
  }

  onCheckCidrBlock() {
    if (this.formData.cidrBlock) {
      this.globalNetworkList = [];
      this.globalNetworkService.checkGlobalNetworkByCidrBlock({ cidrBlock: this.formData.cidrBlock })
        .subscribe(({ body }) => {
          this.globalNetworkList = body
        });
    }
  }

  protected readonly JSON = JSON;
}
