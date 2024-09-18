import { Component, ViewChild } from '@angular/core';
import {
  GroupPageQuery,
  RbacGroupVO,
  RbacResourceVO,
  RbacRoleVO,
  RolePageQuery,
  RoleResourceEdit,
  RoleResourcePageQuery,
} from '../../../../@core/data/rbac';
import { map } from 'rxjs/operators';
import { RbacService } from '../../../../@core/services/rbac.service';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { DataTableComponent } from 'ng-devui';

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

  sourceTableData: Table<RbacResourceVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  targetTableData: Table<RbacResourceVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  group: RbacGroupVO;
  role: RbacRoleVO;

  sourceCheckedLen = 0;
  targetCheckedLen = 0;

  @ViewChild('sourceTable') sourceTable: DataTableComponent;
  @ViewChild('targetTable') targetTable: DataTableComponent;

  constructor(private rbacService: RbacService) {
  }

  fetchData() {
    if ((this.role && this.group)) {
      this._fetchData(false, this.sourceTableData);
      this._fetchData(true, this.targetTableData);
    }
  }

  _fetchData(inRole: boolean, table: Table<RbacResourceVO>) {
    const param: RoleResourcePageQuery = {
      ...this.queryParam,
      inRole: inRole,
      page: table.pager.pageIndex,
      length: table.pager.pageSize,
    };
    onFetchData(table, this.rbacService.queryRoleResourcePage(param));
  }

  sourcePageIndexChange(pageIndex) {
    this.sourceTableData.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  sourcePageSizeChange(pageSize) {
    this.sourceTableData.pager.pageSize = pageSize;
    this.fetchData();
  }

  targetPageIndexChange(pageIndex) {
    this.targetTableData.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  targetPageSizeChange(pageSize) {
    this.targetTableData.pager.pageSize = pageSize;
    this.fetchData();
  }

  onSearchRbacGroup = (term: string) => {
    const param: GroupPageQuery = {
      length: 10, page: 1, queryName: term,
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
      length: 10, page: 1, roleName: term,
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

  sourceRowCheckChange(event: any) {
    this.sourceCheckedLen = this.sourceTable.getCheckedRows().length;
  }

  targetRowCheckChange(event: any) {
    this.targetCheckedLen = this.targetTable.getCheckedRows().length;
  }

  sourceCheckAllChange() {
    this.sourceCheckedLen = this.sourceTable.getCheckedRows().length;
  }

  targetCheckAllChange() {
    this.targetCheckedLen = this.targetTable.getCheckedRows().length;
  }

  transferToTarget() {
    const checkedRows: RbacResourceVO[] = this.sourceTable.getCheckedRows();
    const param: RoleResourceEdit = {
      roleId: this.role.id,
      resourceIds: checkedRows.map(resource => resource.id),
    };
    this.rbacService.addRoleResource(param)
      .subscribe(() => {
        this.fetchData();
        this.targetCheckedLen = 0;
        this.sourceCheckedLen = 0;
      });
  }

  transferToSource() {
    const checkedRows: RbacResourceVO[] = this.targetTable.getCheckedRows();
    const param: RoleResourceEdit = {
      roleId: this.role.id,
      resourceIds: checkedRows.map(resource => resource.id),
    };
    this.rbacService.deleteRoleResource(param)
      .subscribe(() => {
        this.fetchData();
        this.targetCheckedLen = 0;
        this.sourceCheckedLen = 0;
      });
  }

}
