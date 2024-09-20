import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalNetworkRoutingModule } from './global-network-routing.module';
import { GlobalNetworkComponent } from './global-network.component';
import { GlobalNetworkSubnetComponent } from './global-network-subnet/global-network-subnet.component';
import { GlobalNetworkSubnetDataTableComponent } from './global-network-subnet/global-network-subnet-data-table/global-network-subnet-data-table.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import {
  ButtonModule,
  DataTableModule,
  DCommonModule,
  DropDownModule,
  IconModule,
  LoadingModule,
  PaginationModule, SearchModule,
} from 'ng-devui';
import { RelativeTimeModule } from 'ng-devui/relative-time';
import { SharedModule } from '../../@shared/shared.module';
import {
  GlobalNetworkSubnetEditorComponent
} from './global-network-subnet/global-network-subnet-data-table/global-network-subnet-editor/global-network-subnet-editor.component';
import { GlobalNetworkPlanningComponent } from './global-network-planning/global-network-planning.component';
import { GlobalNetworkListComponent } from './global-network-list/global-network-list.component';
import { GlobalNetworkDataTableComponent } from './global-network-list/global-network-data-table/global-network-data-table.component';
import { GlobalNetworkEditorComponent } from './global-network-list/global-network-data-table/global-network-editor/global-network-editor.component';
import {
  GlobalNetworkPlanningDataTableComponent
} from './global-network-planning/global-network-planning-data-table/global-network-planning-data-table.component';
import {
  GlobalNetworkPlanningEditorComponent
} from './global-network-planning/global-network-planning-data-table/global-network-planning-editor/global-network-planning-editor.component';
import { GlobalNetworkDetailsComponent } from './global-network-list/global-network-data-table/global-network-details/global-network-details.component';
import { GlobalNetworkCheckCidrComponent } from './global-network-list/global-network-data-table/global-network-check-cidr/global-network-check-cidr.component';


@NgModule({
  declarations: [
    GlobalNetworkComponent,
    GlobalNetworkSubnetComponent,
    GlobalNetworkSubnetDataTableComponent,
    GlobalNetworkSubnetEditorComponent,
    GlobalNetworkPlanningDataTableComponent,
    GlobalNetworkPlanningEditorComponent,
    GlobalNetworkPlanningComponent,
    GlobalNetworkListComponent,
    GlobalNetworkDataTableComponent,
    GlobalNetworkEditorComponent,
    GlobalNetworkDetailsComponent,
    GlobalNetworkCheckCidrComponent
  ],
  imports: [
    CommonModule,
    GlobalNetworkRoutingModule,
    DaGridModule,
    ButtonModule,
    DCommonModule,
    DataTableModule,
    DropDownModule,
    IconModule,
    LoadingModule,
    PaginationModule,
    RelativeTimeModule,
    SearchModule,
    SharedModule,
  ],
})
export class GlobalNetworkModule { }
