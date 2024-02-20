import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { CredentialService } from '../../../../@core/services/credential.service';
import {
  CredentialAdd,
  CredentialPageQuery,
  CredentialTypeEnum,
  CredentialUpdate,
  CredentialVO,
} from '../../../../@core/data/credential';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { CredentialEditorComponent } from './credential-editor/credential-editor.component';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { finalize, Observable, zip } from 'rxjs';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import { BusinessTypeEnum } from '../../../../@core/data/business';

@Component({
  selector: 'app-credential-data-table',
  templateUrl: './credential-data-table.component.html',
  styleUrls: [ './credential-data-table.component.less' ],
})
export class CredentialDataTableComponent implements OnInit {
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  limit = RELATIVE_TIME_LIMIT;
  businessType: string = BusinessTypeEnum.CREDENTIAL;
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

  newCredential: CredentialAdd = {
    comment: '',
    credential: '',
    credential2: '',
    credentialType: CredentialTypeEnum.USERNAME_WITH_PASSWORD,
    fingerprint: '',
    passphrase: null,
    title: '',
    username: '',
    valid: true,
    privateCredential: false,
    expiredTime: new Date(),
  };

  constructor(private credentialService: CredentialService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  fetchData() {
    const param: CredentialPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.credentialService.queryCredentialPage(param));
  }

  onCellEditEnd(event) {
    const param: CredentialUpdate = {
      id: event.rowItem.id,
      title: event.rowItem.title,
      username: event.rowItem.username,
      comment: event.rowItem.comment,
      valid: event.rowItem.valid,
    };
    this.credentialService.updateCredential(param)
      .pipe(
        finalize(() => this.fetchData()),
      ).subscribe();
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
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Credential',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, {
      ...rowItem,
      expiredTime: new Date(rowItem.expiredTime),
    });
  }

  onRowBusinessTag(rowItem: any) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowValid(rowItem: any) {
    this.credentialService.setCredentialValidById({ id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
        this.fetchData();
      });
  }

  onRowDelete(rowItem: any) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.credentialService.deleteCredentialById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onBatchValid() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchValid,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.credentialService.setCredentialValidById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
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
        obList.push(this.credentialService.deleteCredentialById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }
}
