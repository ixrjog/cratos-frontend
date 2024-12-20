import { Component, ViewChild } from '@angular/core';
import {
  KubernetesResourcesTemplateDataTableComponent,
} from './kubernetes-resources-template-data-table/kubernetes-resources-template-data-table.component';
import {
  KubernetesResourcesMemberDataTableComponent,
} from './kubernetes-resources-member-data-table/kubernetes-resources-member-data-table.component';
import {
  KubernetesResourcesDataTableComponent
} from './kubernetes-resources-data-table/kubernetes-resources-data-table.component';

@Component({
  selector: 'app-eds-template',
  templateUrl: './eds-template.component.html',
  styleUrls: [ './eds-template.component.less' ],
})
export class EdsTemplateComponent {

  @ViewChild('kubernetesResourcesTemplateDataTable') private kubernetesResourcesTemplateDataTable: KubernetesResourcesTemplateDataTableComponent;
  @ViewChild('kubernetesResourcesMemberDataTable') private kubernetesResourcesMemberDataTable: KubernetesResourcesMemberDataTableComponent;
  @ViewChild('kubernetesResourcesDataTable') private kubernetesResourcesDataTable: KubernetesResourcesDataTableComponent;

  tabActiveId: string | number = 'kubernetes-resources-template';

  constructor() {
  }

  onActiveTabChange(tab) {
    switch (tab) {
      case 'kubernetes-resources-template':
        this.kubernetesResourcesTemplateDataTable.fetchData();
        break;
      case 'kubernetes-resources-member':
        this.kubernetesResourcesMemberDataTable.getResourceKindOptions();
        break;
      case 'kubernetes-resources':
        this.kubernetesResourcesDataTable.init();
        break;
      default:
        break;
    }
  }

}
