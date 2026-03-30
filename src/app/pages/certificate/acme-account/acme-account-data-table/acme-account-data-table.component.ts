import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { AcmeService } from '../../../../@core/services/acme.service';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';

@Component({
  selector: 'app-acme-account-data-table',
  templateUrl: './acme-account-data-table.component.html',
  styleUrls: ['./acme-account-data-table.component.less'],
})
export class AcmeAccountDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  queryParam = {
    queryName: '',
  };

  table: Table<any> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(private acmeService: AcmeService) {
  }

  fetchData() {
    const param = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.acmeService.queryAcmeAccountPage(param));
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
