import { Component, ViewChild } from '@angular/core';
import {
  KubernetesResourceTemplateDataTableComponent,
} from './kubernetes-resource-template-data-table/kubernetes-resource-template-data-table.component';
import {
  KubernetesResourceMemberDataTableComponent,
} from './kubernetes-resource-member-data-table/kubernetes-resource-member-data-table.component';
import {
  KubernetesResourceDataTableComponent
} from './kubernetes-resource-data-table/kubernetes-resource-data-table.component';

@Component({
  selector: 'app-eds-template',
  templateUrl: './eds-template.component.html',
  styleUrls: [ './eds-template.component.less' ],
})
export class EdsTemplateComponent {

  @ViewChild('kubernetesResourceTemplateDataTable') private kubernetesResourceTemplateDataTable: KubernetesResourceTemplateDataTableComponent;
  @ViewChild('kubernetesResourceMemberDataTable') private kubernetesResourceMemberDataTable: KubernetesResourceMemberDataTableComponent;
  @ViewChild('kubernetesResourceDataTable') private kubernetesResourceDataTable: KubernetesResourceDataTableComponent;

  tabActiveId: string | number = 'kubernetes-resource-template';

  constructor() {
  }

  onActiveTabChange(tab) {
    console.log(tab)
    switch (tab) {
      case 'kubernetes-resource-template':
        this.kubernetesResourceTemplateDataTable.fetchData();
        break;
      case 'kubernetes-resource-member':
        this.kubernetesResourceMemberDataTable.getResourceKindOptions();
        break;
      case 'kubernetes-resource':
        this.kubernetesResourceDataTable.init();
        break;
      default:
        break;
    }
  }

}
