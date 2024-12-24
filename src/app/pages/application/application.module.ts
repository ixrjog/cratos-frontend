import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationListDataTableComponent } from './application-list/application-list-data-table/application-list-data-table.component';
import { ApplicationEditorComponent } from './application-list/application-list-data-table/application-editor/application-editor.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import {
  ButtonModule,
  DataTableModule,
  DropDownModule,
  IconModule,
  LoadingModule,
  PaginationModule,
  SearchModule,
} from 'ng-devui';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { ApplicationResourcesComponent } from './application-list/application-list-data-table/application-resources/application-resources.component';
import { ApplicationActuatorListComponent } from './application-actuator-list/application-actuator-list.component';
import { ApplicationActuatorListDataTableComponent } from './application-actuator-list/application-actuator-list-data-table/application-actuator-list-data-table.component';


@NgModule({
  declarations: [
    ApplicationComponent,
    ApplicationListComponent,
    ApplicationListDataTableComponent,
    ApplicationEditorComponent,
    ApplicationResourcesComponent,
    ApplicationActuatorListComponent,
    ApplicationActuatorListDataTableComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    DaGridModule,
    ButtonModule,
    DataTableModule,
    DropDownModule,
    FormsModule,
    IconModule,
    LoadingModule,
    PaginationModule,
    SearchModule,
    SharedModule,
  ],
})
export class ApplicationModule { }
