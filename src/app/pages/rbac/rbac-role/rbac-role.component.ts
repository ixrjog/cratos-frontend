import { Component, ViewChild } from '@angular/core';
import { RbacRoleDataTableComponent } from './rbac-role-data-table/rbac-role-data-table.component';
import { RbacRoleAuthorizeComponent } from './rbac-role-authorize/rbac-role-authorize.component';

@Component({
  selector: 'app-rbac-role',
  templateUrl: './rbac-role.component.html',
  styleUrls: [ './rbac-role.component.less' ],
})
export class RbacRoleComponent {

  @ViewChild('rbacRoleDataTable') private rbacRoleDataTable: RbacRoleDataTableComponent;
  @ViewChild('rbacRoleAuthorize') private rbacRoleAuthorize: RbacRoleAuthorizeComponent;

  tabActiveId: string | number = 'role';

  roleSelect: boolean = true;
  roleAuthorizeSelect: boolean = false;

  constructor() {
  }

  onActiveTabChange(tab) {
    switch (tab) {
      case 'role':
        this.roleSelect = true;
        this.roleAuthorizeSelect = false;
        break;
      case 'authorize':
        this.roleSelect = false;
        this.roleAuthorizeSelect = true;
        break;
      default:
        break;
    }
  }
}
