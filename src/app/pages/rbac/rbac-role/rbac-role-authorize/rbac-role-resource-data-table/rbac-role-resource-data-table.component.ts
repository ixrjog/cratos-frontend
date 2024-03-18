import { Component, Input, ViewChild } from '@angular/core';
import { RbacResourceVO, RoleResourcePageQuery } from '../../../../../@core/data/rbac';
import { Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { onFetchData } from '../../../../../@shared/utils/data-table.utli';
import { RbacService } from '../../../../../@core/services/rbac.service';
import { DataTableComponent } from 'ng-devui';

@Component({
  selector: 'app-rbac-role-resource-data-table',
  templateUrl: './rbac-role-resource-data-table.component.html',
  styleUrls: [ './rbac-role-resource-data-table.component.less' ],
})
export class RbacRoleResourceDataTableComponent {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;

  @Input() groupId: number;
  @Input() roleId: number;
  @Input() inRole: boolean;

  table: Table<RbacResourceVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(private rbacService: RbacService) {
  }

  fetchData() {
    const param: RoleResourcePageQuery = {
      groupId: this.groupId,
      roleId: this.roleId,
      inRole: this.inRole,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.rbacService.queryRoleResourcePage(param));
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

}
