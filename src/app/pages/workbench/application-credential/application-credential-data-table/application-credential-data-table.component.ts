import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { ApplicationCredentialPageQuery, ApplicationCredentialVO } from '../../../../@core/data/application-credential';
import { ApplicationCredentialService } from '../../../../@core/services/application-credential.service';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-application-credential-data-table',
  templateUrl: './application-credential-data-table.component.html',
  styleUrls: [ './application-credential-data-table.component.less' ],
})
export class ApplicationCredentialDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;

  queryParam = {
    queryName: '',
  };

  table: Table<ApplicationCredentialVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(private applicationCredentialService: ApplicationCredentialService) {
  }

  fetchData() {
    const param: ApplicationCredentialPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.applicationCredentialService.queryCredentialPage(param));
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
