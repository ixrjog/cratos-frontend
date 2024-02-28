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


@NgModule({
  declarations: [
    ExtDatasourceComponent,
    EdsInstanceComponent,
    EdsConfigComponent,
    EdsConfigDataTableComponent,
    EdsConfigEditorComponent
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
  ],
})
export class ExtDatasourceModule { }
