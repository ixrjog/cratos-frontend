import { Component, ViewChild } from '@angular/core';
import {
  RbacResourceDataTableComponent
} from '../../rbac/rbac-resource/rbac-resource-data-table/rbac-resource-data-table.component';
import {
  RbacGroupDataTableComponent
} from '../../rbac/rbac-resource/rbac-group-data-table/rbac-group-data-table.component';
import {
  TrafficLayerDomainDataTableComponent
} from './traffic-layer-domain-data-table/traffic-layer-domain-data-table.component';
import {
  TrafficLayerRecordDataTableComponent
} from './traffic-layer-record-data-table/traffic-layer-record-data-table.component';

@Component({
  selector: 'app-traffic-layer-domain',
  templateUrl: './traffic-layer-domain.component.html',
  styleUrls: ['./traffic-layer-domain.component.less']
})
export class TrafficLayerDomainComponent {
  @ViewChild('domainDataTable') private domainDataTable: TrafficLayerDomainDataTableComponent;
  @ViewChild('recordDataTable') private recordDataTable: TrafficLayerRecordDataTableComponent;

  tabActiveId: string | number = 'domain';

  constructor() {
  }

  onActiveTabChange(tab) {
    switch (tab) {
      case 'domain':
        this.domainDataTable.fetchData();
        break;
      case 'record':
        this.recordDataTable.fetchData();
        break;
      default:
        break;
    }
  }
}
