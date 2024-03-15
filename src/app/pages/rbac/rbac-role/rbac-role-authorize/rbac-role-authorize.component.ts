import { Component, ViewChild } from '@angular/core';
import { GroupPageQuery, RbacGroupVO, RbacRoleVO, RolePageQuery } from '../../../../@core/data/rbac';
import { map } from 'rxjs/operators';
import { RbacService } from '../../../../@core/services/rbac.service';
import {
  RbacRoleResourceDataTableComponent,
} from './rbac-role-resource-data-table/rbac-role-resource-data-table.component';

@Component({
  selector: 'app-rbac-role-authorize',
  templateUrl: './rbac-role-authorize.component.html',
  styleUrls: ['./rbac-role-authorize.component.less']
})
export class RbacRoleAuthorizeComponent {

  queryParam = {
    groupId: null,
    roleId: null,
  };

  group: RbacGroupVO;
  role: RbacRoleVO;

  sourceCheckedLen = 0;
  targetCheckedLen = 0;

  @ViewChild('sourceTable') sourceTable: RbacRoleResourceDataTableComponent;
  @ViewChild('targetTable') targetTable: RbacRoleResourceDataTableComponent;

  constructor(private rbacService: RbacService) {
  }

  fetchData() {
    this.sourceTable.fetchData();
    this.targetTable.fetchData();
  }

  onSearchRbacGroup = (term: string) => {
    const param: GroupPageQuery = {
      length: 20, page: 1, queryName: term,
    };
    return this.rbacService.queryGroupPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((group, index) => ({ id: index, option: group })),
        ),
      );
  };

  onRbacGroupChange(rbacGroupVO: RbacGroupVO) {
    this.queryParam.groupId = rbacGroupVO.id;
  }

  onSearchRbacRole = (term: string) => {
    const param: RolePageQuery = {
      length: 20, page: 1, roleName: term,
    };
    return this.rbacService.queryRolePage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((role, index) => ({ id: index, option: role })),
        ),
      );
  };

  onRbacRoleChange(rbacRoleVO: RbacRoleVO) {
    this.queryParam.roleId = rbacRoleVO.id;
  }

  transferToTarget() {
    const checkedRows = this.sourceTable.getCheckedRows();
    this.targetCheckedLen = checkedRows.length;
    // Set this parameter to 0.
    this.sourceCheckedLen = 0;
  }

  transferToSource() {
    const checkedRows = this.targetTable.getCheckedRows();
    this.sourceCheckedLen = checkedRows.length;
    // Set this parameter to 0.
    this.targetCheckedLen = 0;
  }

}
