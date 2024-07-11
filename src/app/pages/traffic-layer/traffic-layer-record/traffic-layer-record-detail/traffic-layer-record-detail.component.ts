import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import {
  TrafficLayerDomainPageQuery,
  TrafficLayerDomainVO,
  TrafficLayerRecordQueryDetails,
} from '../../../../@core/data/traffic-layer';
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

  constructor(private trafficLayerService: TrafficLayerService) {
  }

  ngOnInit(): void {
    this.showRecord = false;
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
  envItems = [];

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

  getEnvItems(domainId: number) {
    this.envItems = [];
    this.trafficLayerService.queryTrafficLayerDomainEnv({ domainId: domainId })
      .subscribe(({ body }) => {
        this.envItems = body;
        if (this.envItems.length > 0) {
          let list = JSON.parse(JSON.stringify(this.envItems));
          for (; ;) {
            let env = list.pop();
            if (env.valid) {
              this.queryParam.envName = env.envName;
              this.tabActiveId = env.envName;
              break;
            }
          }
        }
      });
  }

  onTrafficLayerDomainChange(domainVO: TrafficLayerDomainVO) {
    this.queryParam.domainId = domainVO.id;
    this.queryParam.envName = '';
    this.getEnvItems(domainVO.id);
  }

  protected readonly JSON = JSON;
}
