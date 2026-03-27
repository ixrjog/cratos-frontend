import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { AcmeDomainPageQuery, AcmeDomainVO, AcmeService } from '../../../../@core/services/acme.service';
import { onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';

@Component({
  selector: 'app-acme-domain-data-table',
  templateUrl: './acme-domain-data-table.component.html',
  styleUrls: ['./acme-domain-data-table.component.less'],
})
export class AcmeDomainDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;
  businessType: string = BusinessTypeEnum.ACME_DOMAIN;

  queryParam = {
    queryName: '',
  };

  table: Table<AcmeDomainVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(private acmeService: AcmeService) {
  }

  fetchData() {
    const param: AcmeDomainPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.acmeService.queryAcmeDomainPage(param));
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
