import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  DataTableModule,
  DropDownModule,
  IconModule,
  LoadingModule,
  PaginationModule,
  SearchModule,
} from 'ng-devui';
import { UserScriptRoutingModule } from './user-script-routing.module';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { SharedModule } from '../../@shared/shared.module';
import { UserScriptComponent } from './user-script.component';
import { UserScriptDataTableComponent } from './user-script-data-table/user-script-data-table.component';
import {
  UserScriptEditorComponent,
} from './user-script-data-table/user-script-editor/user-script-editor.component';

@NgModule({
  declarations: [
    UserScriptComponent,
    UserScriptDataTableComponent,
    UserScriptEditorComponent,
  ],
  imports: [
    CommonModule,
    UserScriptRoutingModule,
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
export class UserScriptModule {
}
