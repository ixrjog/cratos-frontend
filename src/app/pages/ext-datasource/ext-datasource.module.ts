import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtDatasourceRoutingModule } from './ext-datasource-routing.module';
import { ExtDatasourceComponent } from './ext-datasource.component';
import { EdsInstanceComponent } from './eds-instance/eds-instance.component';
import { EdsConfigComponent } from './eds-config/eds-config.component';
import { EdsConfigDataTableComponent } from './eds-config/eds-config-data-table/eds-config-data-table.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { EdsConfigEditorComponent } from './eds-config/eds-config-data-table/eds-config-editor/eds-config-editor.component';
import {
  ButtonModule,
  DataTableModule,
  DropDownModule,
  IconModule,
  LoadingModule,
  PaginationModule,
  SearchModule,
} from 'ng-devui';
import { SharedModule } from '../../@shared/shared.module';
import { EdsInstanceCardListComponent } from './eds-instance/eds-instance-card-list/eds-instance-card-list.component';
import {
  EdsInstanceEditorComponent
} from './eds-instance/eds-instance-card-list/eds-instance-editor/eds-instance-editor.component';
import {
  EdsInstanceCardComponent
} from './eds-instance/eds-instance-card-list/eds-instance-card/eds-instance-card.component';
import { EdsAssetComponent } from './eds-instance/eds-asset/eds-asset.component';
import { EdsAssetDataTableComponent } from './eds-instance/eds-asset/eds-asset-data-table/eds-asset-data-table.component';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    ExtDatasourceComponent,
    EdsInstanceComponent,
    EdsConfigComponent,
    EdsConfigDataTableComponent,
    EdsConfigEditorComponent,
    EdsInstanceEditorComponent,
    EdsInstanceCardComponent,
    EdsInstanceCardListComponent,
    EdsAssetComponent,
    EdsAssetDataTableComponent
  ],
  imports: [
    CommonModule,
    ExtDatasourceRoutingModule,
    DaGridModule,
    ButtonModule,
    DataTableModule,
    DropDownModule,
    IconModule,
    LoadingModule,
    PaginationModule,
    SearchModule,
    SharedModule,
    MarkdownModule,
  ],
})
export class ExtDatasourceModule { }
