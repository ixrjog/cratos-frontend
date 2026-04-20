import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { HttpResult, Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { OrganizationEdit, OrganizationPageQuery, OrganizationVO } from '../../../../../@core/data/organization';
import { OrganizationService } from '../../../../../@core/services/organization.service';
import { OrganizationEditorComponent } from './organization-editor/organization-editor.component';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-organization-list-data-table',
  templateUrl: './organization-list-data-table.component.html',
  styleUrls: ['./organization-list-data-table.component.less'],
})
export class OrganizationListDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    code: '',
  };
  table: Table<OrganizationVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newOrganization: OrganizationEdit = {
    name: '',
    code: '',
    type: '',
    valid: true,
    comment: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: OrganizationEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private organizationService: OrganizationService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: OrganizationPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.organizationService.queryOrganizationPage(param));
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
      title: 'New Organization',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newOrganization)));
  }

  onRowEdit(rowItem: OrganizationVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Organization',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: OrganizationVO) {
    this.organizationService.setOrganizationValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: OrganizationVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.organizationService.deleteOrganizationById({ id: rowItem.id })
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
        obList.push(this.organizationService.deleteOrganizationById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onCellEditEnd(event) {
    const param: OrganizationEdit = {
      id: event.rowItem.id,
      name: event.rowItem.name,
      code: event.rowItem.code,
      type: event.rowItem.type,
      comment: event.rowItem.comment,
      valid: event.rowItem.valid,
    };
    this.organizationService.updateOrganization(param)
      .pipe(
        catchError((error: any) => {
          this.fetchData();
          return new error();
        }),
      )
      .subscribe();
  }

  protected readonly getRowColor = getRowColor;
}
