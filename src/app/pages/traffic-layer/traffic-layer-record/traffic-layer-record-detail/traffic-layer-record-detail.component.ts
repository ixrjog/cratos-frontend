import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import {
  TrafficLayerDomainPageQuery,
  TrafficLayerDomainVO,
  TrafficLayerRecordQueryDetails,
} from '../../../../@core/data/traffic-layer';
import { finalize } from 'rxjs';
import { FormLayout } from 'ng-devui/form';

@Component({
  selector: 'app-traffic-layer-record-detail',
  templateUrl: './traffic-layer-record-detail.component.html',
  styleUrls: [ './traffic-layer-record-detail.component.less' ],
})
export class TrafficLayerRecordDetailComponent implements OnInit {

  private static readonly DOMAIN_STORAGE_KEY = 'traffic_record_selected_domain';
  private static readonly ENV_STORAGE_KEY = 'traffic_record_selected_env';

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
    const savedDomain = localStorage.getItem(TrafficLayerRecordDetailComponent.DOMAIN_STORAGE_KEY);
    const savedEnv = localStorage.getItem(TrafficLayerRecordDetailComponent.ENV_STORAGE_KEY);
    if (savedDomain) {
      try {
        const domain = JSON.parse(savedDomain);
        this.trafficLayerDomain = domain;
        this.queryParam.domainId = domain.id;
        this.getEnvItems(domain.id);
        if (savedEnv) {
          this.queryParam.envName = savedEnv;
          this.tabActiveId = savedEnv;
        }
      } catch (e) {}
    }
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
    localStorage.setItem(TrafficLayerRecordDetailComponent.ENV_STORAGE_KEY, tab || '');
  }

  onSearchTrafficLayerDomain = (term: string) => {
    const param: TrafficLayerDomainPageQuery = {
      length: 10, page: 1, queryName: term,
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
              localStorage.setItem(TrafficLayerRecordDetailComponent.ENV_STORAGE_KEY, env.envName);
              break;
            }
          }
        }
      });
  }

  onTrafficLayerDomainChange(domainVO: TrafficLayerDomainVO) {
    this.showRecord = false;
    this.queryParam.domainId = domainVO.id;
    this.queryParam.envName = '';
    localStorage.setItem(TrafficLayerRecordDetailComponent.DOMAIN_STORAGE_KEY, JSON.stringify({ id: domainVO.id, domain: domainVO.domain, name: domainVO.name }));
    localStorage.removeItem(TrafficLayerRecordDetailComponent.ENV_STORAGE_KEY);
    this.getEnvItems(domainVO.id);
  }

  protected readonly JSON = JSON;
  protected readonly FormLayout = FormLayout;
}
