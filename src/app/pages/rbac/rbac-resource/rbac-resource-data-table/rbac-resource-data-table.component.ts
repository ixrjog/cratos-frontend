import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { GroupPageQuery, RbacGroupVO, RbacResourceVO, ResourcePageQuery } from '../../../../@core/data/rbac';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { RbacService } from '../../../../@core/services/rbac.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { RbacResourceEditorComponent } from './rbac-resource-editor/rbac-resource-editor.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-rbac-resource-data-table',
  templateUrl: './rbac-resource-data-table.component.html',
  styleUrls: [ './rbac-resource-data-table.component.less' ],
})
export class RbacResourceDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    valid: null,
    groupId: null,
  };
  group: RbacGroupVO = null;
  limit = RELATIVE_TIME_LIMIT;
  table: Table<RbacResourceVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: RbacResourceEditorComponent,
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
    const param: ResourcePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.rbacService.queryResourcePage(param));
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

  onRowEdit(rowItem: RbacResourceVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit RBAC Resource',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: RbacResourceVO) {
    this.rbacService.setResourceValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: RbacResourceVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.rbacService.deleteResourceById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onBatchDelete() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchDelete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.rbacService.deleteResourceById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  protected readonly getRowColor = getRowColor;
}
