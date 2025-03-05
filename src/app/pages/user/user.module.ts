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
import {
  UserInfoEditorComponent,
} from './user-list/user-list-data-table/user-editor/user-info-editor/user-info-editor.component';
import {
  UserRbacEditorComponent,
} from './user-list/user-list-data-table/user-editor/user-rbac-editor/user-rbac-editor.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserBaseSettingsComponent } from './user-settings/user-base-settings/user-base-settings.component';
import { UserSshKeySettingsComponent } from './user-settings/user-ssh-key-settings/user-ssh-key-settings.component';
import { UserRobotSettingsComponent } from './user-settings/user-robot-settings/user-robot-settings.component';
import { MarkdownModule } from 'ngx-markdown';
import { UserPermissionsComponent } from './user-list/user-list-data-table/user-permissions/user-permissions.component';
import {
  UserPermissionsEditorComponent,
} from './user-list/user-list-data-table/user-editor/user-permissions-editor/user-permissions-editor.component';
import { UserRenewalComponent } from './user-list/user-list-data-table/user-renewal/user-renewal.component';
import { UserSshKeyEditorComponent } from './user-list/user-list-data-table/user-editor/user-ssh-key-editor/user-ssh-key-editor.component';
import { UserIdentityEditorComponent } from './user-list/user-list-data-table/user-editor/user-identity-editor/user-identity-editor.component';

@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserListDataTableComponent,
    UserEditorComponent,
    UserInfoEditorComponent,
    UserRbacEditorComponent,
    UserSettingsComponent,
    UserBaseSettingsComponent,
    UserSshKeySettingsComponent,
    UserRobotSettingsComponent,
    UserPermissionsComponent,
    UserPermissionsEditorComponent,
    UserRenewalComponent,
    UserSshKeyEditorComponent,
    UserIdentityEditorComponent,
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
    MarkdownModule,
  ],
})
export class UserModule { }
