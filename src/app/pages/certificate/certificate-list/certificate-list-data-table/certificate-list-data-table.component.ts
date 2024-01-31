import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CertificateService } from '../../../../@core/services/certificate.service';
import { CertificateEdit, CertificatePageQuery, CertificateVo } from '../../../../@core/data/certificate';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DataTableComponent, ToastService } from 'ng-devui';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { CertificateEditorComponent } from './certificate-editor/certificate-editor.component';
import { TagVo } from '../../../../@core/data/tag';
import { Observable, zip } from 'rxjs';
import { BusinessTypeEnum } from '../../../../@core/data/business-tag';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';

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
  limit = 3 * 12 * 30 * 24 * 60 * 60;   // three years
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
    private toastService: ToastService,
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
      .subscribe(({ body }) => {
        this.table.data = body.data;
        for (let row of this.table.data) {
          if (!row.valid) {
            row['$rowClass'] = 'table-row-invalid';
            console.log(row);
          }
        }
        this.table.loading = false;
        this.table.pager.total = body.totalNum;
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
      title: 'New Certificate',
      ...this.dialogDate.editorData,
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, this.newCertificate);
  }

  onRowEdit(rowItem: CertificateVo) {
    const dialogDate = {
      title: 'Edit Certificate',
      ...this.dialogDate.editorData,
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
          this.toastService.open({
            value: [ { severity: 'success', summary: 'Success', content: 'Delete Success' } ],
            life: 2000,
          });
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
      const checkedRows: TagVo[] = this.datatable.getCheckedRows();
      let obList: Observable<HttpResult<Boolean>>[] = [];
      for (let row of checkedRows) {
        obList.push(this.certificateService.setCertificateValidById({ id: row.id }));
      }
      zip(obList)
        .subscribe(() => {
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
      const checkedRows: TagVo[] = this.datatable.getCheckedRows();
      let obList: Observable<HttpResult<Boolean>>[] = [];
      for (let row of checkedRows) {
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
