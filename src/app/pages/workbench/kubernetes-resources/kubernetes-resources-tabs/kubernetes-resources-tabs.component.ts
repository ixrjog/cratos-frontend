import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationPageQuery, ApplicationVO } from '../../../../@core/data/application';
import { KubernetesDetailsVO } from '../../../../@core/data/kubernetes';
import { ApplicationResourceService } from '../../../../@core/services/application-resource.service';
import { ApplicationService } from '../../../../@core/services/application.service';
import {
  QueryApplicationResourceKubernetesDetails,
  QueryKubernetesDeploymentOptions,
} from '../../../../@core/data/application-resource';
import { finalize, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  WebSocketApiService,
  WsMessageActionEnum,
  WsMessageTopicEnum,
} from '../../../../@core/services/ws.api.service';
import { ApplicationKubernetesDetailsRequest } from '../../../../@core/data/kubernetes-resource';
import { MessageResponse } from '../../../../@core/data/base-data';
import { ToastUtil } from '../../../../@shared/utils/toast.util';
import { WS_HEART_INTERVAL, WS_INIT_INTERVAL } from '../../../../@shared/constant/ws.constant';

@Component({
  selector: 'app-kubernetes-resources-tabs',
  templateUrl: './kubernetes-resources-tabs.component.html',
  styleUrls: [ './kubernetes-resources-tabs.component.less' ],
})
export class KubernetesResourcesTabsComponent implements OnInit, OnDestroy {

  queryParam = {
    applicationName: '',
    namespace: '',
    name: '',
  };

  first = false;
  tabActiveId: string | number = 'workloads';
  application: ApplicationVO;
  kubernetesApplication: ApplicationVO;
  resourceNameOptions = [];
  nameSpaceLoading = false;
  loading = false;
  kubernetesDetails: KubernetesDetailsVO = null;
  deploymentList = [];
  serviceList = [];
  resourceNamespaceOptions = [];
  show = false;

  ws: WebSocket;
  timerRequest: Subscription;
  wsHeartbeatTimerRequest: Subscription;

  constructor(
    private applicationResourceService: ApplicationResourceService,
    private applicationService: ApplicationService,
    private wsApiService: WebSocketApiService,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    this.show = false;
    this.kubernetesDetails = null;
    this.deploymentList = [];
    this.serviceList = [];
    this.kubernetesApplication = null;
    if (this.queryParam.applicationName !== '' && this.queryParam.namespace !== '') {
      const param: QueryApplicationResourceKubernetesDetails = {
        ...this.queryParam,
      };
      this.loading = true;
      this.applicationResourceService.queryApplicationResourceKubernetesDetails(param)
        .pipe(
          finalize(() => {
          this.loading = false;
          }),
        ).subscribe(
        ({ body }) => {
          if (body.body.success) {
            this.kubernetesDetails = body.body;
            this.deploymentList = this.kubernetesDetails?.workloads?.deployments;
            this.serviceList = this.kubernetesDetails?.network?.services;
            this.show = true;
            this.kubernetesApplication = this.kubernetesDetails?.application;
          } else {
            this.toastUtil.onErrorToast(body.body.message, { width: '600px' });
          }
        },
      );
      this.wsOnSubSend();
      this.wsOnMessage();
    }
  }

  onSearchApplication = (term: string) => {
    const param: ApplicationPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.applicationService.queryApplicationPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((application, index) => ({ id: index, option: application })),
        ),
      );
  };

  onApplicationChange(application: ApplicationVO) {
    if (!this.first) {
      this.first = true;
    }
    this.queryParam.applicationName = application?.name;
    this.queryParam.namespace = ''
    this.wsOnUnsubSend();
    this.fetchData()
    if (this.queryParam.applicationName) {
      this.getResourceNamespaceOptions();
    }
  }

  onNameChange(name: string) {
    this.wsOnUnsubSend();
    this.fetchData();
  }

  onResourceNamespaceChange(tab) {
    this.queryParam.namespace = tab;
    this.queryParam.name = '';
    this.fetchData();
    const parma: QueryKubernetesDeploymentOptions = {
      applicationName: this.application.name,
      namespace: this.queryParam.namespace,
    };
    this.applicationResourceService.queryApplicationResourceKubernetesDeploymentOptions(parma)
      .subscribe(({ body }) => {
        this.resourceNameOptions = body.options.map(item => item.value);
      });
  }

  getResourceNamespaceOptions() {
    this.nameSpaceLoading = true;
    this.queryParam.name = '';
    this.resourceNameOptions = [];
    this.applicationService.getMyResourceNamespaceOptions({ applicationName: this.application.name })
      .pipe(
        finalize(() => {
          this.nameSpaceLoading = false;
        }),
      ).subscribe(
      ({ body }) => this.resourceNamespaceOptions = body.options);
  };

  wsOnInit() {
    this.ws = this.wsApiService.createWsClient('/application/kubernetes/details');
  }

  onWsHeartbeat() {
    this.timerRequest = timer(5000, WS_HEART_INTERVAL)
      .subscribe(num => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.wsApiService.onPing(this.ws);
        }
      });
  }

  ngOnInit(): void {
    this.wsOnInit();
    this.wsOnOpen();
    this.initInterval();
    this.onWsHeartbeat();
  }

  ngOnDestroy(): void {
    try {
      this.timerRequest.unsubscribe();
      this.wsHeartbeatTimerRequest.unsubscribe();
      this.ws.close();
      this.ws = null;
    } catch (error) {
    }
    localStorage.removeItem('kubernetes_resources');
  }

  initInterval() {
    this.timerRequest = timer(1000, WS_INIT_INTERVAL)
      .subscribe(num => {
        if (this.ws?.readyState !== WebSocket.OPEN
          && this.ws?.readyState !== WebSocket.CONNECTING
          && this.ws?.readyState !== WebSocket.CLOSING) {
          this.wsOnInit();
          this.wsOnOpen();
          this.wsOnSubSend();
          this.wsOnMessage();
        }
      });
  }

  wsOnOpen() {
    this.ws.onopen = (event) => {
    };
  }

  wsOnSubSend() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      if (this.queryParam.applicationName === '' && this.queryParam.namespace === '') {
        return;
      }
      const param: ApplicationKubernetesDetailsRequest = {
        topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_DETAILS,
        action: WsMessageActionEnum.SUBSCRIPTION,
        applicationName: this.queryParam.applicationName,
        namespace: this.queryParam.namespace,
        name: this.queryParam.name,
      };
      this.ws.send(JSON.stringify(param));
    }
  }

  wsOnUnsubSend() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const param: ApplicationKubernetesDetailsRequest = {
        topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_DETAILS,
        action: WsMessageActionEnum.UNSUBSCRIBE,
      };
      this.ws.send(JSON.stringify(param));
    }
  }

  wsOnMessage() {
    this.ws.onmessage = (event) => {
      const msg: MessageResponse<KubernetesDetailsVO> = JSON.parse(event.data);
      if (msg.topic === WsMessageTopicEnum.APPLICATION_KUBERNETES_DETAILS) {
        if (msg.body.success) {
          if (msg.body.application.name === this.queryParam.applicationName
            && msg.body.namespace === this.queryParam.namespace) {
            this.kubernetesDetails = msg.body;
            this.serviceList = this.kubernetesDetails?.network?.services;
            if (this.queryParam.name !== '' && this.queryParam.name !== null) {
              this.deploymentList = this.kubernetesDetails?.workloads?.deployments.filter(
                deployment => deployment.metadata.name === this.queryParam.name,
              );
            } else {
              this.deploymentList = this.kubernetesDetails?.workloads?.deployments;
            }
          }
        } else {
          this.wsOnUnsubSend();
        }
      }
    };
  }

  protected readonly JSON = JSON;
}
