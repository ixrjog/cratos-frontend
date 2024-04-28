import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomainRoutingModule } from './domain-routing.module';
import { DomainComponent } from './domain.component';
import { DomainListComponent } from './domain-list/domain-list.component';
import { DomainListDataTableComponent } from './domain-list/domain-list-data-table/domain-list-data-table.component';
import { DomainEditorComponent } from './domain-list/domain-list-data-table/domain-editor/domain-editor.component';
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


@NgModule({
  declarations: [
    DomainComponent,
    DomainListComponent,
    DomainListDataTableComponent,
    DomainEditorComponent
  ],
  imports: [
    CommonModule,
    DomainRoutingModule,
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
export class DomainModule { }
