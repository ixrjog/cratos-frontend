import { Component, OnInit, ViewChild } from '@angular/core';
import { CertificateService } from '../../../../@core/services/certificate.service';
import { CertificateEdit, CertificatePageQuery, CertificateVO } from '../../../../@core/data/certificate';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DataTableComponent } from 'ng-devui';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { CertificateEditorComponent } from './certificate-editor/certificate-editor.component';
import { Observable, zip } from 'rxjs';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import { BusinessTypeEnum } from '../../../../@core/data/business';

@Component({
  selector: 'app-certificate-list-data-table',
  templateUrl: './certificate-list-data-table.component.html',
  styleUrls: [ './certificate-list-data-table.component.less' ],
})
export class CertificateListDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
  };
  limit = RELATIVE_TIME_LIMIT;
  businessType: string = BusinessTypeEnum.CERTIFICATE;

  table: Table<CertificateVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newCertificate: CertificateEdit = {
    certificateId: '',
    certificateType: '',
    domainName: '',
    keyAlgorithm: '',
    name: '',
    notAfter: null,
    notBefore: new Date(),
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
    const param: CertificatePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.certificateService.queryCertificatePage(param));
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
    }, JSON.parse(JSON.stringify(this.newCertificate)));
  }

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

  onRowValid(rowItem: CertificateVO) {
    this.certificateService.setCertificateValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: CertificateVO) {
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
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.certificateService.setCertificateValidById({ id: row.id }));
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
        obList.push(this.certificateService.deleteCertificateById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: CertificateVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: CertificateVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  protected readonly getRowColor = getRowColor;

}
