import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CertificateService } from '../../../../@core/services/certificate.service';
import { CertificateEdit, CertificatePageQuery, CertificateVo } from '../../../../@core/data/certificate';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DataTableComponent } from 'ng-devui';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { CertificateEditorComponent } from './certificate-editor/certificate-editor.component';
import { TagVO } from '../../../../@core/data/tag';
import { Observable, zip } from 'rxjs';
import { BusinessTypeEnum } from '../../../../@core/data/business-tag';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';

@Component({
  selector: 'app-certificate-list-data-table',
  templateUrl: './certificate-list-data-table.component.html',
  styleUrls: [ './certificate-list-data-table.component.less' ],
})
export class CertificateListDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  @Input()
  queryParam = {
    queryName: '',
  };
  limit = RELATIVE_TIME_LIMIT;   // three years
  businessType: string = BusinessTypeEnum.CERTIFICATE;

  table: Table<CertificateVo> = {
    ...TABLE_DATA,
  };

  newCertificate: CertificateEdit = {
    certificateId: '',
    certificateType: '',
    domainName: '',
    keyAlgorithm: '',
    name: '',
    notAfter: null,
    notBefore: null,
    valid: true,
    comment: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: CertificateEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private certificateService: CertificateService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    this.table.data = [];
    this.table.loading = true;
    const param: CertificatePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    this.certificateService.queryCertificatePage(param)
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

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Certificate',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, this.newCertificate);
  }

  onRowEdit(rowItem: CertificateVo) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Certificate',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: any) {
    this.certificateService.setCertificateValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: CertificateVo) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.certificateService.deleteCertificateById({ id: rowItem.id })
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
      for (let row of this.datatable.getCheckedRows()) {
        obList.push(this.certificateService.setCertificateValidById({ id: row.id }));
      }
      zip(obList)
        .subscribe(() => {
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
      for (let row of this.datatable.getCheckedRows()) {
        obList.push(this.certificateService.deleteCertificateById({ id: row.id }));
      }
      zip(obList)
        .subscribe(() => {
          this.fetchData();
        });
    });
  }

  onRowBusinessTag(rowItem: CertificateVo) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  protected readonly getRowColor = getRowColor;
}
