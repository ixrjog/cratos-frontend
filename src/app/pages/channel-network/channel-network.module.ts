import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelNetworkRoutingModule } from './channel-network-routing.module';
import { ChannelNetworkComponent } from './channel-network.component';
import { ChannelNetworkListComponent } from './channel-network-list/channel-network-list.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import {
  ChannelNetworkListDataTableComponent,
} from './channel-network-list/channel-network-list-data-table/channel-network-list-data-table.component';
import {
  ChannelNetworkEditorComponent,
} from './channel-network-list/channel-network-list-data-table/channel-network-editor/channel-network-editor.component';
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


@NgModule({
  declarations: [
    ChannelNetworkComponent,
    ChannelNetworkEditorComponent,
    ChannelNetworkListComponent,
    ChannelNetworkListDataTableComponent,
  ],
  imports: [
    CommonModule,
    ChannelNetworkRoutingModule,
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
export class ChannelNetworkModule {
}
