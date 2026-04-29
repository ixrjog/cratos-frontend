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
import { ChannelInfoListComponent } from './channel-info/channel-info-list/channel-info-list.component';
import { ChannelInfoListDataTableComponent } from './channel-info/channel-info-list/channel-info-list-data-table/channel-info-list-data-table.component';
import { ChannelInfoEditorComponent } from './channel-info/channel-info-list/channel-info-list-data-table/channel-info-editor/channel-info-editor.component';
import { ChannelExtensionEditorComponent } from './channel-info/channel-info-list/channel-info-list-data-table/channel-extension-editor/channel-extension-editor.component';
import { ChannelBusinessListComponent } from './channel-business/channel-business-list/channel-business-list.component';
import { ChannelBusinessListDataTableComponent } from './channel-business/channel-business-list/channel-business-list-data-table/channel-business-list-data-table.component';
import { ChannelBusinessEditorComponent } from './channel-business/channel-business-list/channel-business-list-data-table/channel-business-editor/channel-business-editor.component';
import { ChannelBusinessLineEditorComponent } from './channel-business/channel-business-list/channel-business-list-data-table/channel-business-line-editor/channel-business-line-editor.component';
import { ChannelViewComponent } from './channel-view/channel-view.component';
import { ChannelNodeListComponent } from './channel-line/channel-line-list/channel-line-list.component';
import { ChannelNodeListDataTableComponent } from './channel-line/channel-line-list/channel-line-list-data-table/channel-line-list-data-table.component';
import { ChannelNodeEditorComponent } from './channel-line/channel-line-list/channel-line-list-data-table/channel-line-editor/channel-node-editor.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import {
  ButtonModule,
  CardModule,
  CheckBoxModule,
  DataTableModule,
  DCommonModule,
  DropDownModule,
  IconModule,
  LoadingModule,
  PaginationModule,
  SearchModule,
  SelectModule,
  TabsModule,
  TagsModule,
} from 'ng-devui';
import { RelativeTimeModule } from 'ng-devui/relative-time';
import { SharedModule } from '../../@shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { WorkbenchModule } from '../workbench/workbench.module';

@NgModule({
  declarations: [
    ChannelComponent,
    OrganizationListComponent,
    OrganizationListDataTableComponent,
    OrganizationEditorComponent,
    ChannelNetworkListComponent,
    ChannelNetworkListDataTableComponent,
    ChannelNetworkEditorComponent,
    ChannelInfoListComponent,
    ChannelInfoListDataTableComponent,
    ChannelInfoEditorComponent,
    ChannelExtensionEditorComponent,
    ChannelBusinessListComponent,
    ChannelBusinessListDataTableComponent,
    ChannelBusinessEditorComponent,
    ChannelBusinessLineEditorComponent,
    ChannelViewComponent,
    ChannelNodeListComponent,
    ChannelNodeListDataTableComponent,
    ChannelNodeEditorComponent,
  ],
  imports: [
    CommonModule,
    ChannelRoutingModule,
    DaGridModule,
    ButtonModule,
    CardModule,
    CheckBoxModule,
    DCommonModule,
    DataTableModule,
    DropDownModule,
    IconModule,
    LoadingModule,
    PaginationModule,
    RelativeTimeModule,
    SearchModule,
    SelectModule,
    SharedModule,
    MarkdownModule,
    TabsModule,
    TagsModule,
    WorkbenchModule,
  ],
})
export class ChannelModule {
}
