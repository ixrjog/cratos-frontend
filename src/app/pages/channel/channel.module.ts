import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelRoutingModule } from './channel-routing.module';
import { ChannelComponent } from './channel.component';
import { OrganizationListComponent } from './organization/organization-list/organization-list.component';
import { OrganizationListDataTableComponent } from './organization/organization-list/organization-list-data-table/organization-list-data-table.component';
import { OrganizationEditorComponent } from './organization/organization-list/organization-list-data-table/organization-editor/organization-editor.component';
import { ChannelNetworkListComponent } from '../channel-network/channel-network-list/channel-network-list.component';
import { ChannelNetworkListDataTableComponent } from '../channel-network/channel-network-list/channel-network-list-data-table/channel-network-list-data-table.component';
import { ChannelNetworkEditorComponent } from '../channel-network/channel-network-list/channel-network-list-data-table/channel-network-editor/channel-network-editor.component';
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
  TagsModule,
} from 'ng-devui';
import { RelativeTimeModule } from 'ng-devui/relative-time';
import { SharedModule } from '../../@shared/shared.module';

@NgModule({
  declarations: [
    ChannelComponent,
    OrganizationListComponent,
    OrganizationListDataTableComponent,
    OrganizationEditorComponent,
    ChannelNetworkListComponent,
    ChannelNetworkListDataTableComponent,
    ChannelNetworkEditorComponent,
  ],
  imports: [
    CommonModule,
    ChannelRoutingModule,
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
    TagsModule,
  ],
})
export class ChannelModule {
}
