import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { AcmeReconciliationPageQuery, AcmeReconciliationVO } from '../../../../@core/data/acme-reconciliation';
import { AcmeReconciliationService } from '../../../../@core/services/acme-reconciliation.service';

@Component({
  selector: 'app-acme-reconciliation-data-table',
  templateUrl: './acme-reconciliation-data-table.component.html',
  styleUrls: [ './acme-reconciliation-data-table.component.less' ],
})
export class AcmeReconciliationDataTableComponent implements OnInit {

  queryParam = {
    queryName: '',
    instanceName: '',
  };

  table: Table<AcmeReconciliationVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  /** 实例 tab: 不重复的 instanceName 及数量('' 表示全部) */
  instanceTabs: { name: string; count: number }[] = [];
  totalCount = 0;
  activeInstance: string | number = '';

  constructor(private acmeReconciliationService: AcmeReconciliationService) {
  }

  ngOnInit() {
    this.fetchData();
    this.loadInstanceTabs();
  }

  /** 拉取(不分页)统计各 instanceName 数量作为 tab */
  loadInstanceTabs() {
    this.acmeReconciliationService.queryAcmeReconciliationPage({
      queryName: '',
      instanceName: '',
      page: 1,
      length: 1000,
    }).subscribe(({ body }) => {
      const list = body?.data || [];
      const map = new Map<string, number>();
      list.forEach((r) => {
        const n = r.instanceName || '-';
        map.set(n, (map.get(n) || 0) + 1);
      });
      this.totalCount = list.length;
      this.instanceTabs = Array.from(map.entries())
        .map(([ name, count ]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  onInstanceTabChange(name: string) {
    this.activeInstance = name;
    this.queryParam.instanceName = name;
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  fetchData() {
    const param: AcmeReconciliationPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.acmeReconciliationService.queryAcmeReconciliationPage(param));
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;
}
