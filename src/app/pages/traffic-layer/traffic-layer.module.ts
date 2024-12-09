import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrafficLayerRoutingModule } from './traffic-layer-routing.module';
import { TrafficLayerComponent } from './traffic-layer.component';
import { TrafficLayerDomainComponent } from './traffic-layer-domain/traffic-layer-domain.component';
import { TrafficLayerRecordComponent } from './traffic-layer-record/traffic-layer-record.component';
import {
  TrafficLayerDomainDataTableComponent,
} from './traffic-layer-domain/traffic-layer-domain-data-table/traffic-layer-domain-data-table.component';
import {
  TrafficLayerDomainEditorComponent,
} from './traffic-layer-domain/traffic-layer-domain-data-table/traffic-layer-domain-editor/traffic-layer-domain-editor.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import {
  ButtonModule,
  DataTableModule,
  DCommonModule,
  DropDownModule,
  IconModule,
  LoadingModule,
  PaginationModule,
  SearchModule,
  TabsModule,
} from 'ng-devui';
import { ReactiveFormsModule } from '@angular/forms';
import { RelativeTimeModule } from 'ng-devui/relative-time';
import { SharedModule } from '../../@shared/shared.module';
import {
  TrafficLayerRecordDetailComponent,
} from './traffic-layer-record/traffic-layer-record-detail/traffic-layer-record-detail.component';
import {
  TrafficLayerRecordDataTableComponent,
} from './traffic-layer-domain/traffic-layer-record-data-table/traffic-layer-record-data-table.component';
import {
  TrafficLayerRecordEditorComponent,
} from './traffic-layer-domain/traffic-layer-record-data-table/traffic-layer-record-editor/traffic-layer-record-editor.component';
import { TrafficLayerIngressComponent } from './traffic-layer-ingress/traffic-layer-ingress.component';
import { TrafficLayerIngressDetailComponent } from './traffic-layer-ingress/traffic-layer-ingress-detail/traffic-layer-ingress-detail.component';
import { TrafficLayerLimitComponent } from './traffic-layer-limit/traffic-layer-limit.component';
import {
  TrafficLayerIngressLimitDataTableComponent
} from './traffic-layer-limit/traffic-layer-ingress-limit-data-table/traffic-layer-ingress-limit-data-table.component';


@NgModule({
  declarations: [
    TrafficLayerComponent,
    TrafficLayerDomainComponent,
    TrafficLayerRecordComponent,
    TrafficLayerDomainDataTableComponent,
    TrafficLayerDomainEditorComponent,
    TrafficLayerRecordDetailComponent,
    TrafficLayerRecordDataTableComponent,
    TrafficLayerRecordEditorComponent,
    TrafficLayerIngressComponent,
    TrafficLayerIngressDetailComponent,
    TrafficLayerLimitComponent,
    TrafficLayerIngressLimitDataTableComponent,
  ],
  imports: [
    CommonModule,
    TrafficLayerRoutingModule,
    DaGridModule,
    TabsModule,
    ButtonModule,
    DCommonModule,
    DataTableModule,
    DropDownModule,
    IconModule,
    LoadingModule,
    PaginationModule,
    ReactiveFormsModule,
    RelativeTimeModule,
    SearchModule,
    SharedModule,
  ],
})
export class TrafficLayerModule {
}
