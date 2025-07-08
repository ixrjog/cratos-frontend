import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationPageQuery, ApplicationVO, ScanResource } from '../../../../@core/data/application';
import { KubernetesDetailsVO } from '../../../../@core/data/kubernetes';
import { ApplicationResourceService } from '../../../../@core/services/application-resource.service';
import { ApplicationService } from '../../../../@core/services/application.service';
import {
  QueryApplicationResourceKubernetesDetails,
  QueryKubernetesDeploymentOptions,
} from '../../../../@core/data/application-resource';
import { finalize, of, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  WebSocketApiService,
  WsMessageActionEnum,
  WsMessageTopicEnum,
} from '../../../../@core/services/ws.api.service';
import { ApplicationKubernetesDetailsRequest } from '../../../../@core/data/kubernetes-resource';
import { MessageResponse } from '../../../../@core/data/base-data';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { WS_HEART_INTERVAL, WS_INIT_INTERVAL } from '../../../../@shared/constant/ws.constant';
import { ActivatedRoute } from '@angular/router';
import { UserFavoriteService } from '../../../../@core/services/user-favorite.service';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { AddUserFavorite, RemoveUserFavorite } from '../../../../@core/data/user-favorite';

@Component({
  selector: 'app-kubernetes-resources-tabs',
  templateUrl: './kubernetes-resources-tabs.component.html',
  styleUrls: [ './kubernetes-resources-tabs.component.less' ],
})
export class KubernetesResourcesTabsComponent implements OnInit, OnDestroy, AfterViewInit {

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
  isFavorite: boolean;
  favoriteApplicationList: ApplicationVO[] = [];

  isCollapsed = true;

  ws: WebSocket;
  timerRequest: Subscription;
  wsHeartbeatTimerRequest: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userFavoriteService: UserFavoriteService,
    private applicationResourceService: ApplicationResourceService,
    private applicationService: ApplicationService,
    private wsApiService: WebSocketApiService,
    private toastUtil: ToastUtil,

  ) {
  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {
      if (param['applicationName'] !== undefined) {
        this.queryParam.applicationName  = param['applicationName']
        this.applicationService.getApplicationByName({name: this.queryParam.applicationName})
          .subscribe(({body}) => {
            this.application = body;
            this.isFavorite = this.application.favorited;
            this.queryParam.namespace = param['namespace'] !== undefined ? param['namespace'] : '';
            if (!this.first) {
              this.first = true;
            }
            this.getResourceNamespaceOptions();
            this.queryParam.name = param['name'] !== undefined ? param['name'] : '';

            const parma: QueryKubernetesDeploymentOptions = {
              applicationName: this.application.name,
              namespace: this.queryParam.namespace,
            };
            this.applicationResourceService.queryApplicationResourceKubernetesDeploymentOptions(parma)
              .subscribe(({ body }) => {
                this.resourceNameOptions = body.options.map(item => item.value);
              });

            this.fetchData();
          })
      }
    });
    this.onGetUserFavorite();
  }

  onGetUserFavorite() {
    this.userFavoriteService.getMyFavoriteApplication()
      .subscribe(({ body }) => {
        this.favoriteApplicationList = body;
      });
  }

  onAddApplicationFavorite(applicationId: number) {
    const param: AddUserFavorite = {
      businessType: BusinessTypeEnum.APPLICATION,
      businessId: applicationId,
    };
    this.userFavoriteService.addApplicationFavorite(param)
      .subscribe(() => {
        this.onGetUserFavorite();
      });
  }

  onRemoveApplicationFavorite(applicationId: number) {
    const param: RemoveUserFavorite = {
      businessType: BusinessTypeEnum.APPLICATION,
      businessId: applicationId,
    };
    this.userFavoriteService.removeApplicationFavorite(param)
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
        if (this.application?.id === applicationId) {
          this.isFavorite = false;
        }
        this.onGetUserFavorite();
      });

  }

  onClick(application: ApplicationVO) {
    this.application = application;
    this.onApplicationChange(application);
    this.onAddApplicationFavorite(application.id);
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
            this.wsOnSubSend();
            this.wsOnMessage();
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
    }
  }

  onScanData() {
    const param: ScanResource = {
      name: this.queryParam.applicationName,
    };
    this.loading = true;
    this.toastUtil.onCommonToast(TOAST_CONTENT.OPERATION);
    this.applicationService.scanApplicationResource(param)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.SCAN);
        this.fetchData();
      });
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
    this.isFavorite = application.favorited;
    this.queryParam.applicationName = application?.name;
    this.queryParam.namespace = ''
    this.wsOnUnsubSend();
    this.fetchData()
    if (this.queryParam.applicationName) {
      this.getResourceNamespaceOptions();
    }
  }

  onSelectResourceName = (term) => {
    return of(
      this.resourceNameOptions
        .map((option, index) => ({ id: index, option: option }))
        .filter((item) => item.option.toLowerCase().indexOf(term.toLowerCase()) !== -1),
    );
  };

  onResourceNameChange(name: string) {
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
    this.wsHeartbeatTimerRequest = timer(5000, WS_HEART_INTERVAL)
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

  wsOnClose() {
    try {
      if (this.timerRequest) {
        this.timerRequest.unsubscribe();
        this.timerRequest = null;
      }
      if (this.wsHeartbeatTimerRequest) {
        this.wsHeartbeatTimerRequest.unsubscribe();
        this.wsHeartbeatTimerRequest = null;
      }
      if (this.ws) {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        if (this.ws.readyState === WebSocket.OPEN ||
          this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close();
        }
        this.ws = null;
      }
    } catch (error) {
    }
  }

  ngOnDestroy(): void {
    this.wsOnClose();
    localStorage.removeItem('kubernetes_resources');
    localStorage.removeItem('kubernetes_resources_version');
  }

  initInterval() {
    this.timerRequest = timer(1000, WS_INIT_INTERVAL)
      .subscribe(num => {
        if (this.ws?.readyState !== WebSocket.OPEN
          && this.ws?.readyState !== WebSocket.CONNECTING
          && this.ws?.readyState !== WebSocket.CLOSING) {
          this.wsOnClose();
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

  onFavoriteClick() {
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      this.onAddApplicationFavorite(this.application.id);
    } else {
      this.onRemoveApplicationFavorite(this.application.id);
    }
  }

  protected readonly JSON = JSON;
}
