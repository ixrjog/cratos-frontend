import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { KubernetesResourceTemplatePageQuery } from '../../../../@core/data/kubernetes-resource';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import { TrafficLayerIngressTrafficLimitVO } from '../../../../@core/data/traffic-layer';

@Component({
  selector: 'app-traffic-layer-ingress-limit-data-table',
  templateUrl: './traffic-layer-ingress-limit-data-table.component.html',
  styleUrls: [ './traffic-layer-ingress-limit-data-table.component.less' ],
})
export class TrafficLayerIngressLimitDataTableComponent implements OnInit {

  queryParam = {
    queryName: '',
  };

  table: Table<TrafficLayerIngressTrafficLimitVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(
    private trafficLayerService: TrafficLayerService,
  ) {
  }

  fetchData() {
    const param: KubernetesResourceTemplatePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.trafficLayerService.queryIngressTrafficLimitPage(param));
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  ngOnInit(): void {
    this.fetchData();
  }

}
