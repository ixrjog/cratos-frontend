import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { CredentialService } from '../../../../@core/services/credential.service';
import {
  CredentialEdit,
  CredentialPageQuery,
  CredentialTypeEnum,
  CredentialVO,
} from '../../../../@core/data/credential';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { CredentialEditorComponent } from './credential-editor/credential-editor.component';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { Observable, zip } from 'rxjs';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';

@Component({
  selector: 'app-credential-data-table',
  templateUrl: './credential-data-table.component.html',
  styleUrls: [ './credential-data-table.component.less' ],
})
export class CredentialDataTableComponent implements OnInit {
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  limit = RELATIVE_TIME_LIMIT;
  @Input()
  queryParam = {
    queryName: '',
    credentialType: '',
  };

  table: Table<CredentialVO> = {
    ...TABLE_DATA
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: CredentialEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  newCredential: CredentialEdit = {
    comment: '',
    credential: '',
    credential2: '',
    credentialType: CredentialTypeEnum.USERNAME_WITH_PASSWORD,
    fingerprint: '',
    passphrase: '',
    title: '',
    username: '',
    valid: true,
    expiredTime: new Date(),
  };

  constructor(private credentialService: CredentialService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  fetchData() {
    this.table.data = [];
    this.table.loading = true;
    const param: CredentialPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    this.credentialService.queryCredentialPage(param)
      .subscribe(res => {
        onFetchValidData(this.table, res);
      });
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

  protected readonly getRowColor = getRowColor;

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Credential',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, this.newCredential);
  }

  onRowEdit(rowItem: any) {

  }

  onRowBusinessTag(rowItem: any) {

  }

  onRowValid(rowItem: any) {
    this.credentialService.setCredentialValidById({ id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
        this.fetchData();
      });
  }

  onRowDelete(rowItem: any) {

  }

  onBatchValid() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchValid,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      for (let row of this.datatable.getCheckedRows()) {
        obList.push(this.credentialService.setCredentialValidById({ id: row.id }));
      }
      zip(obList)
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
          this.fetchData();
        });
    });
  }

  onBatchDelete() {

  }
}
