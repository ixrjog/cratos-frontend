import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CertificateService } from '../../../../@core/services/certificate.service';
import { CertificatePageQuery, CertificateVo } from '../../../../@core/data/certificate';
import { Table } from '../../../../@core/data/base-data';
import { DataTableComponent, DialogService, ToastService } from 'ng-devui';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { DialogUtil } from '../../../../@shared/utils/dialog.util';

@Component({
  selector: 'app-certificate-manage-data-table',
  templateUrl: './certificate-manage-data-table.component.html',
  styleUrls: [ './certificate-manage-data-table.component.less' ],
})
export class CertificateManageDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  @Input() queryParam = {
    queryName: '',
  };

  table: Table<CertificateVo> = {
    showLoading: false,
    data: [],
    pager: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
  };

  columns = [
    {
      field: 'certificateId',
      header: 'Certificate Id',
      fieldType: 'text',
    },
    {
      field: 'name',
      header: 'Name',
      fieldType: 'text',
    },
    {
      field: 'domainName',
      header: 'Domain Name',
      fieldType: 'text',
    },
    {
      field: 'certificateType',
      header: 'Certificate Type',
      fieldType: 'text',
    },
    {
      field: 'createTime',
      header: 'Create Time',
      fieldType: 'date',
    },
  ];

  constructor(
    private certificateService: CertificateService,
    private dialogService: DialogService,
    private dialogUtil: DialogUtil,
    private toastService: ToastService,
  ) {
  }

  fetchData() {
    this.table.data = [];
    this.table.showLoading = true;
    const param: CertificatePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    this.certificateService.queryCertificatePage(param)
      .subscribe(({ body }) => {
        this.table.data = body.data;
        this.table.showLoading = false;
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

  onRowNew(dialogtype: string) {

  }

  onRowCheckChange(checked, rowIndex, nestedIndex, rowItem) {
    rowItem.$checked = checked;
    rowItem.$halfChecked = false;
    this.datatable.setRowCheckStatus({
      rowIndex: rowIndex,
      nestedIndex: nestedIndex,
      rowItem: rowItem,
      checked: checked,
    });
  }

  onRowEdit(rowItem: CertificateVo, standard: string) {

  }

  protected readonly getRowColor = getRowColor;

  onRowValid(rowItem: any) {
    this.certificateService.setCertificateValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: CertificateVo) {

  }

  onBatchValid() {

  }

  onBatchDelete() {

  }
}
