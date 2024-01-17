import { Component, Input, OnInit } from '@angular/core';
import { Table } from '../../../../@core/data/base-data';
import { CredentialService } from '../../../../@core/services/credential.service';
import { CredentialPageQuery, CredentialVo } from '../../../../@core/data/credential';

@Component({
  selector: 'app-credential-data-table',
  templateUrl: './credential-data-table.component.html',
  styleUrls: [ './credential-data-table.component.less' ],
})
export class CredentialDataTableComponent implements OnInit {

  @Input() queryParam = {
    queryName: '',
    credentialType: '',
  };

  table: Table<CredentialVo> = {
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
      field: 'title',
      header: 'Title',
      fieldType: 'text',
    },
    {
      field: 'credentialType',
      header: 'Credential Type',
      fieldType: 'text',
    },
    {
      field: 'username',
      header: 'Username',
      fieldType: 'text',
    },
    {
      field: 'createTime',
      header: 'Create Time',
      fieldType: 'date',
    },
  ];

  constructor(private credentialService: CredentialService) {
  }

  fetchData() {
    this.table.data = [];
    this.table.showLoading = true;
    const param: CredentialPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    this.credentialService.queryCredentialPage(param)
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
