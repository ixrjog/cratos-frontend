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


@NgModule({
  declarations: [
    GlobalNetworkComponent,
    GlobalNetworkSubnetComponent,
    GlobalNetworkSubnetDataTableComponent,
    GlobalNetworkSubnetEditorComponent
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
