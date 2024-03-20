import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RbacRoutingModule } from './rbac-routing.module';
import { RbacComponent } from './rbac.component';
import { RbacResourceComponent } from './rbac-resource/rbac-resource.component';
import { RbacRoleComponent } from './rbac-role/rbac-role.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { SharedModule } from '../../@shared/shared.module';
import { RbacResourceDataTableComponent } from './rbac-resource/rbac-resource-data-table/rbac-resource-data-table.component';
import { RbacGroupDataTableComponent } from './rbac-resource/rbac-group-data-table/rbac-group-data-table.component';
import { RbacGroupEditorComponent } from './rbac-resource/rbac-group-data-table/rbac-group-editor/rbac-group-editor.component';
import { RbacResourceEditorComponent } from './rbac-resource/rbac-resource-data-table/rbac-resource-editor/rbac-resource-editor.component';
import { RbacRoleDataTableComponent } from './rbac-role/rbac-role-data-table/rbac-role-data-table.component';
import { RbacRoleEditorComponent } from './rbac-role/rbac-role-data-table/rbac-role-editor/rbac-role-editor.component';
import { RbacRoleAuthorizeComponent } from './rbac-role/rbac-role-authorize/rbac-role-authorize.component';
import { RbacRoleResourceDataTableComponent } from './rbac-role/rbac-role-authorize/rbac-role-resource-data-table/rbac-role-resource-data-table.component';


@NgModule({
  declarations: [
    RbacComponent,
    RbacResourceComponent,
    RbacRoleComponent,
    RbacResourceDataTableComponent,
    RbacGroupDataTableComponent,
    RbacGroupEditorComponent,
    RbacResourceEditorComponent,
    RbacRoleDataTableComponent,
    RbacRoleEditorComponent,
    RbacRoleAuthorizeComponent,
    RbacRoleResourceDataTableComponent,
  ],
  imports: [
    CommonModule,
    RbacRoutingModule,
    DaGridModule,
    SharedModule,
  ],
})
export class RbacModule {
}
