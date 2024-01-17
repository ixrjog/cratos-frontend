import { Component, Input, OnInit } from '@angular/core';
import { CertificateService } from '../../../../@core/services/certificate.service';
import { CertificatePageQuery, CertificateVo } from '../../../../@core/data/certificate';
import { Table } from '../../../../@core/data/base-data';

@Component({
  selector: 'app-certificate-manage-data-table',
  templateUrl: './certificate-manage-data-table.component.html',
  styleUrls: [ './certificate-manage-data-table.component.less' ],
})
export class CertificateManageDataTableComponent implements OnInit {

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

  constructor(private certificateService: CertificateService) {
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
}
