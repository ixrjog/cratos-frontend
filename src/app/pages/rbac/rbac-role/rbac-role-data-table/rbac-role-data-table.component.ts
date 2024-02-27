import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { CertificateVO } from '../../../../@core/data/certificate';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { RbacRoleVO, RolePageQuery } from '../../../../@core/data/rbac';
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

  table: Table<RbacRoleVO> = {
    ...TABLE_DATA,
  };



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

  // onRowNew() {
  //   const dialogDate = {
  //     ...this.dialogDate.editorData,
  //     title: 'New Certificate',
  //   };
  //   this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
  //     this.fetchData();
  //   }, this.newCertificate);
  // }

  onRowEdit(rowItem: CertificateVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Certificate',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, {
      ...rowItem,
      notAfter: new Date(rowItem.notAfter),
      notBefore: new Date(rowItem.notBefore),
    });
  }


  // onRowDelete(rowItem: CertificateVO) {
  //   const dialogDate = {
  //     ...this.dialogDate.warningOperateData,
  //     content: this.dialogDate.content.delete,
  //   };
  //   this.dialogUtil.onDialog(dialogDate, () => {
  //     this.certificateService.deleteCertificateById({ id: rowItem.id })
  //       .subscribe(() => {
  //         this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
  //         this.fetchData();
  //       });
  //   });
  // }

  // onBatchDelete() {
  //   const dialogDate = {
  //     ...this.dialogDate.warningOperateData,
  //     content: this.dialogDate.content.batchDelete,
  //   };
  //   this.dialogUtil.onDialog(dialogDate, () => {
  //     let obList: Observable<HttpResult<Boolean>>[] = [];
  //     this.datatable.getCheckedRows().map(row => {
  //       obList.push(this.certificateService.deleteCertificateById({ id: row.id }));
  //     });
  //     zip(obList).subscribe(() => {
  //       this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
  //       this.fetchData();
  //     });
  //   });
  // }

}
