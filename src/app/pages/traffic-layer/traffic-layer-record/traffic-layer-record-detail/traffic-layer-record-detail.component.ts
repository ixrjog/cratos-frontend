import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import {
  TrafficLayerDomainPageQuery,
  TrafficLayerDomainVO,
  TrafficLayerRecordQueryDetails,
} from '../../../../@core/data/traffic-layer';

import { EnvService } from '../../../../@core/services/env.service';
import { EnvPageQuery, EnvVO } from '../../../../@core/data/env';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-traffic-layer-record-detail',
  templateUrl: './traffic-layer-record-detail.component.html',
  styleUrls: [ './traffic-layer-record-detail.component.less' ],
})
export class TrafficLayerRecordDetailComponent implements OnInit {

  trafficLayerDomain: TrafficLayerDomainVO;
  loading = false;
  showRecord = false;
  tableDetails = {
    recordTable: '',
    lbTable: '',
    ingressRuleTable: '',
  };
  queryParam = {
    domainId: null,
    envName: '',
  };

  constructor(private trafficLayerService: TrafficLayerService,
              private envService: EnvService) {
  }

  ngOnInit(): void {
    this.showRecord = false;
    this.getEnvItems();
  }

  getEnvItems() {
    const param: EnvPageQuery = {
      length: 20, page: 1, queryName: '',
    };
    this.envService.queryEnvPage(param)
      .subscribe(({ body }) => {
        this.envItems = body.data;
        this.queryParam.envName = this.envItems[this.envItems.length - 1].envName;
        this.tabActiveId = this.envItems[this.envItems.length - 1].envName;
      });
  }

  fetchData() {
    const param: TrafficLayerRecordQueryDetails = {
      ...this.queryParam,
    };
    this.showRecord = true;
    this.loading = true;
    this.trafficLayerService.queryRecordDetails(param)
      .pipe(
        finalize(() => this.loading = false),
      )
      .subscribe(({ body }) => {
        this.tableDetails = body.tableDetails;
      });
  }

  tabActiveId: string | number = '';
  envItems: EnvVO[] = [];

  activeTabChange(tab) {
    this.queryParam.envName = tab;
  }

  onSearchTrafficLayerDomain = (term: string) => {
    const param: TrafficLayerDomainPageQuery = {
      length: 20, page: 1, queryName: term,
    };
    return this.trafficLayerService.queryTrafficLayerDomainPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((group, index) => ({ id: index, option: group })),
        ),
      );
  };

  onTrafficLayerDomainChange(domainVO: TrafficLayerDomainVO) {
    this.queryParam.domainId = domainVO.id;
  }

  protected readonly JSON = JSON;
}
