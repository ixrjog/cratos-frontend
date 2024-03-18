import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RbacRoleEdit, RbacRoleVO, RolePageQuery } from '../../../../@core/data/rbac';
import { RbacRoleEditorComponent } from './rbac-role-editor/rbac-role-editor.component';
import { RbacService } from '../../../../@core/services/rbac.service';

@Component({
  selector: 'app-rbac-role-data-table',
  templateUrl: './rbac-role-data-table.component.html',
  styleUrls: [ './rbac-role-data-table.component.less' ],
})
export class RbacRoleDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    roleName: '',
  };
  limit = RELATIVE_TIME_LIMIT;

  table: Table<RbacRoleVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: RbacRoleEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  newRbacRole: RbacRoleEdit = {
    accessLevel: 1, comment: '', roleName: '', workOrderVisible: false,
  };

  constructor(
    private rbacService: RbacService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: RolePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.rbacService.queryRolePage(param));
  }

  ngOnInit() {
    this.fetchData();
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New RBAC Role',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, this.newRbacRole);
  }

  onRowEdit(rowItem: RbacRoleVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit RBAC Role',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowDelete(rowItem: RbacRoleVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.rbacService.deleteRoleById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

}
