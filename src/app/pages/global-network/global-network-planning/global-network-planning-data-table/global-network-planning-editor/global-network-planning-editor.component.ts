import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import {
  GlobalNetworkPageQuery,
  GlobalNetworkPlanningEdit,
  GlobalNetworkPlanningVO,
  GlobalNetworkVO,
} from '../../../../../@core/data/global-network';
import { DValidateRules } from 'ng-devui';
import { GlobalNetworkService } from '../../../../../@core/services/global-network.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-global-network-planning-editor',
  templateUrl: './global-network-planning-editor.component.html',
  styleUrls: [ './global-network-planning-editor.component.less' ],
})
export class GlobalNetworkPlanningEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: GlobalNetworkPlanningVO;
  operationType: boolean;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private globalNetworkService: GlobalNetworkService) {
  }

  onSearchNetwork = (term: string) => {
    const param: GlobalNetworkPageQuery = {
      length: 20, page: 1, queryName: term,
    };
    return this.globalNetworkService.queryGlobalNetworkPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((network, index) => ({ id: index, option: network })),
        ),
      );
  };

  onNetworkChange(network: GlobalNetworkVO) {
    this.formData.networkId = network.id;
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    console.log(this.formData)
  }

  addForm() {
    const param: GlobalNetworkPlanningEdit = {
      ...this.formData,
    };
    return this.globalNetworkService.addGlobalNetworkPlanning(param);
  }

  updateForm() {
    const param: GlobalNetworkPlanningEdit = {
      ...this.formData,
    };
    return this.globalNetworkService.updateGlobalNetworkPlanning(param);
  }

}
