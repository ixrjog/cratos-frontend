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

  constructor() {
  }

  onActiveTabChange(tab) {
    switch (tab) {
      case 'role':
        break;
      case 'authorize':
        break;
      default:
        break;
    }
  }
}
