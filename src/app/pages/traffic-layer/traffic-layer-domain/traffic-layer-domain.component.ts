import { Component, ViewChild } from '@angular/core';
import {
  TrafficLayerDomainDataTableComponent
} from './traffic-layer-domain-data-table/traffic-layer-domain-data-table.component';

@Component({
  selector: 'app-traffic-layer-domain',
  templateUrl: './traffic-layer-domain.component.html',
  styleUrls: ['./traffic-layer-domain.component.less']
})
export class TrafficLayerDomainComponent {
  @ViewChild('domainDataTable') private domainDataTable: TrafficLayerDomainDataTableComponent;

  constructor() {
  }
}
