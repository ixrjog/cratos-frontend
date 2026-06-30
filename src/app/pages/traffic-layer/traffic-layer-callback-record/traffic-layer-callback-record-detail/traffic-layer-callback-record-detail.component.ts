import { Component, OnInit } from '@angular/core';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import {
  TrafficLayerDomainVO,
  TrafficLayerRecordQueryDetails,
} from '../../../../@core/data/traffic-layer';
import { finalize } from 'rxjs';
import { FormLayout } from 'ng-devui/form';

@Component({
  selector: 'app-traffic-layer-callback-record-detail',
  templateUrl: './traffic-layer-callback-record-detail.component.html',
  styleUrls: [ './traffic-layer-callback-record-detail.component.less' ],
})
export class TrafficLayerCallbackRecordDetailComponent implements OnInit {

  private static readonly DOMAIN_STORAGE_KEY = 'traffic_callback_record_selected_domain';
  private static readonly ENV_STORAGE_KEY = 'traffic_callback_record_selected_env';

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

  /** All callback domains (loaded from /domain/callback/query). */
  callbackDomains: TrafficLayerDomainVO[] = [];
  /** Currently active domain tab id. */
  activeDomainId: any = null;

  constructor(private trafficLayerService: TrafficLayerService) {
  }

  ngOnInit(): void {
    this.showRecord = false;
    this.loadCallbackDomains();
    const savedDomain = localStorage.getItem(TrafficLayerCallbackRecordDetailComponent.DOMAIN_STORAGE_KEY);
    const savedEnv = localStorage.getItem(TrafficLayerCallbackRecordDetailComponent.ENV_STORAGE_KEY);
    if (savedDomain) {
      try {
        const domain = JSON.parse(savedDomain);
        this.trafficLayerDomain = domain;
        this.activeDomainId = domain.id;
        this.queryParam.domainId = domain.id;
        this.getEnvItems(domain.id);
        if (savedEnv) {
          this.queryParam.envName = savedEnv;
          this.tabActiveId = savedEnv;
        }
      } catch (e) {}
    }
  }

  private loadCallbackDomains() {
    this.trafficLayerService.queryCallbackDomain()
      .subscribe(({ body }) => {
        this.callbackDomains = body || [];
        // Replace the restored partial domain with the full object so tags/dns render.
        if (this.activeDomainId != null) {
          const full = this.callbackDomains.find(d => d.id === this.activeDomainId);
          if (full) {
            this.trafficLayerDomain = full;
          }
        }
      });
  }

  onDomainTabChange(domainId: any) {
    const domain = this.callbackDomains.find(d => d.id === domainId);
    if (domain) {
      this.onTrafficLayerDomainChange(domain);
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
    localStorage.setItem(TrafficLayerCallbackRecordDetailComponent.ENV_STORAGE_KEY, tab || '');
  }

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
              localStorage.setItem(TrafficLayerCallbackRecordDetailComponent.ENV_STORAGE_KEY, env.envName);
              break;
            }
          }
        }
      });
  }

  onTrafficLayerDomainChange(domainVO: TrafficLayerDomainVO) {
    this.showRecord = false;
    this.trafficLayerDomain = domainVO;
    this.activeDomainId = domainVO.id;
    this.queryParam.domainId = domainVO.id;
    this.queryParam.envName = '';
    localStorage.setItem(TrafficLayerCallbackRecordDetailComponent.DOMAIN_STORAGE_KEY, JSON.stringify({ id: domainVO.id, domain: domainVO.domain, name: domainVO.name }));
    localStorage.removeItem(TrafficLayerCallbackRecordDetailComponent.ENV_STORAGE_KEY);
    this.getEnvItems(domainVO.id);
  }

  protected readonly JSON = JSON;
  protected readonly FormLayout = FormLayout;
}
