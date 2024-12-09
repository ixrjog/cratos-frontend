import { Component, ViewChild } from '@angular/core';
import {
  TrafficLayerIngressLimitDataTableComponent,
} from './traffic-layer-ingress-limit-data-table/traffic-layer-ingress-limit-data-table.component';

@Component({
  selector: 'app-traffic-layer-limit',
  templateUrl: './traffic-layer-limit.component.html',
  styleUrls: [ './traffic-layer-limit.component.less' ],
})
export class TrafficLayerLimitComponent {
  @ViewChild('ingressLimitDataTable') private ingressLimitDataTable: TrafficLayerIngressLimitDataTableComponent;

  tabActiveId: string | number = 'ingress';

  constructor() {
  }

  onActiveTabChange(tab) {
    switch (tab) {
      case 'ingress':
        this.ingressLimitDataTable.fetchData();
        break;
      default:
        break;
    }
  }
}
