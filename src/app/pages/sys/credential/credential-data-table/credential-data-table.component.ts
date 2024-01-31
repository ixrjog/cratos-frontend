import { Component, Input, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { CredentialService } from '../../../../@core/services/credential.service';
import { CredentialPageQuery, CredentialVo } from '../../../../@core/data/credential';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';

@Component({
  selector: 'app-credential-data-table',
  templateUrl: './credential-data-table.component.html',
  styleUrls: [ './credential-data-table.component.less' ],
})
export class CredentialDataTableComponent implements OnInit {

  @Input()
  queryParam = {
    queryName: '',
    credentialType: '',
  };

  table: Table<CredentialVo> = {
    ...TABLE_DATA
  };

  constructor(private credentialService: CredentialService) {
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

  protected readonly getRowColor = getRowColor;

  onRowEdit(rowItem: any) {

  }

  onRowBusinessTag(rowItem: any) {

  }

  onRowValid(rowItem: any) {

  }

  onRowDelete(rowItem: any) {

  }

  onBatchValid() {

  }

  onBatchDelete() {

  }
}
