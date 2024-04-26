import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserListDataTableComponent } from './user-list/user-list-data-table/user-list-data-table.component';
import { UserEditorComponent } from './user-list/user-list-data-table/user-editor/user-editor.component';
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
import { UserInfoEditorComponent } from './user-list/user-list-data-table/user-editor/user-info-editor/user-info-editor.component';
import { UserRbacEditorComponent } from './user-list/user-list-data-table/user-editor/user-rbac-editor/user-rbac-editor.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';


@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserListDataTableComponent,
    UserEditorComponent,
    UserInfoEditorComponent,
    UserRbacEditorComponent,
    UserSettingsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
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
export class UserModule { }
