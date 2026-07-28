import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApplicationPageQuery, ApplicationVO, ScanResource } from '../../../../@core/data/application';
import { KubernetesDetailsVO } from '../../../../@core/data/kubernetes';
import { ApplicationResourceService } from '../../../../@core/services/application-resource.service';
import { ApplicationService } from '../../../../@core/services/application.service';
import {
  QueryApplicationResourceKubernetesDetails,
  QueryKubernetesDeploymentOptions,
  OpsTaskVO,
} from '../../../../@core/data/application-resource';
import { finalize, of, Subject, Subscription, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
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
import { DialogService } from 'ng-devui';

@Component({
  selector: 'app-kubernetes-resources-tabs',
  templateUrl: './kubernetes-resources-tabs.component.html',
  styleUrls: [ './kubernetes-resources-tabs.component.less' ],
})
export class KubernetesResourcesTabsComponent implements OnInit, OnDestroy {

  /** True when the current device is detected as mobile via user-agent. */
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  /**
   * User-toggled switch to force the simplified (mobile) layout.
   * Defaults to ON; an explicitly persisted 'false' disables it. Persisted in localStorage.
   */
  forceMobile = localStorage.getItem(KubernetesResourcesTabsComponent.FM_STORAGE_KEY) !== 'false';

  /** Effective mobile state: real mobile device OR user forced compact mode. */
  get effectiveMobile(): boolean {
    return this.isMobile || this.forceMobile;
  }

  /** Topology tab is restricted to a specific user. */
  // Topology is restricted to the 'baiyi' user or sessions authenticated via biometric/WebAuthn.
  canViewTopology = localStorage.getItem('username') === 'baiyi'
    || localStorage.getItem('loginMethod') === 'webauthn';

  /** Ops actions (task files, pod-card Ops) restricted to 'baiyi' or biometric/WebAuthn sessions. */
  canOps = localStorage.getItem('username') === 'baiyi'
    || localStorage.getItem('loginMethod') === 'webauthn';

  private static readonly APP_STORAGE_KEY = 'k8s_resources_selected_app';
  private static readonly NS_STORAGE_KEY = 'k8s_resources_selected_namespace';
  private static readonly CC_STORAGE_KEY = 'k8s_resources_selected_countrycode';
  private static readonly FM_STORAGE_KEY = 'k8s_resources_force_mobile';

  queryParam = {
    applicationName: '',
    instanceName: '',
    namespace: '',
    name: '',
    countryCode: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? '' : 'ng',
  };

  countryCodeOptions = ['', 'ng', 'bd', 'pk', 'ph'];

  resourceName: string = '';

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

  isCollapsed = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  ws: WebSocket;
  wsStatus: 'connecting' | 'connected' | 'closed' = 'closed';
  // Live WS traffic meter (application-layer payload approximation; excludes framing/compression/TLS).
  wsBytesIn = 0;
  wsBytesOut = 0;
  wsMsgIn = 0;
  wsMsgOut = 0;
  wsRateIn = 0;   // bytes/sec over the last sampling window
  wsRateOut = 0;  // bytes/sec over the last sampling window
  wsTrafficExpanded = false;  // show the live traffic detail only after expanding
  private wsLastBytesIn = 0;
  private wsLastBytesOut = 0;
  timerRequest: Subscription;
  wsHeartbeatTimerRequest: Subscription;
  private destroy$ = new Subject<void>();

  // Pause/close the WS while the tab is hidden; resume when visible again.
  private pageHidden = false;
  private visibilityHandler = () => this.onVisibilityChange();

  // WS detail-push throttling/dedupe state.
  private static readonly DETAILS_THROTTLE_MS = 500;
  private pendingDetails: KubernetesDetailsVO | null = null;
  private detailsFlushScheduled = false;
  private lastDetailsAppliedAt = 0;
  private lastDeploymentsSignature = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private userFavoriteService: UserFavoriteService,
    private applicationResourceService: ApplicationResourceService,
    private applicationService: ApplicationService,
    private wsApiService: WebSocketApiService,
    private toastUtil: ToastUtil,
    private dialogService: DialogService,
  ) {
  }

  /** ===== My Ops task files (jstack/heap dumps etc.) ===== */
  @ViewChild('myOpsFilesTpl') myOpsFilesTpl: TemplateRef<any>;
  myOpsTasks: OpsTaskVO[] = [];
  myOpsTasksLoading = false;
  opsTaskDownloading: { [taskNo: string]: boolean } = {};

  opsTaskAnalyzing: { [taskNo: string]: boolean } = {};

  /** Open a dialog listing my latest 5 ops task files. */
  openMyOpsFiles() {
    this.myOpsTasks = [];
    this.myOpsTasksLoading = true;
    const results = this.dialogService.open({
      id: 'k8s-my-ops-files',
      width: '1400px',
      maxHeight: '80vh',
      title: 'My Ops Task Files',
      dialogtype: 'standard',
      backdropCloseable: true,
      contentTemplate: this.myOpsFilesTpl,
      buttons: [
        {
          cssClass: 'common',
          text: 'Close',
          handler: () => results.modalInstance.hide(),
        },
      ],
    });
    this.applicationResourceService.queryMyOpsTaskFiles()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.myOpsTasksLoading = false),
      )
      .subscribe(({ body }) => {
        this.myOpsTasks = body || [];
      });
  }

  /** Fetch the presigned download URL for a task and copy it to the clipboard. */
  copyOpsTaskDownloadUrl(task: OpsTaskVO) {
    if (!task || !task.taskNo || this.opsTaskDownloading[task.taskNo]) {
      return;
    }
    this.opsTaskDownloading[task.taskNo] = true;
    this.applicationResourceService.getOpsTaskFile({ taskNo: task.taskNo })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.opsTaskDownloading[task.taskNo] = false),
      )
      .subscribe({
        next: ({ body }) => {
          if (body?.downloadUrl) {
            this.copyText(body.downloadUrl, '下载地址已复制');
          } else {
            this.toastUtil.onErrorToast('下载地址不可用（文件可能已过期/无效）。');
          }
        },
        error: () => this.toastUtil.onErrorToast('获取下载地址失败'),
      });
  }

  /** Fetch the signed analysis request, base64-encode it, and open the Jifa online-analysis page. */
  onOpsTaskAnalyze(task: OpsTaskVO) {
    if (!task || !task.taskNo || this.opsTaskAnalyzing[task.taskNo]) {
      return;
    }
    this.opsTaskAnalyzing[task.taskNo] = true;
    this.applicationResourceService.getOpsTaskFile({ taskNo: task.taskNo })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.opsTaskAnalyzing[task.taskNo] = false),
      )
      .subscribe({
        next: ({ body }) => {
          if (body?.jifaAnalysisRequest) {
            const ar = encodeURIComponent(this.toBase64(body.jifaAnalysisRequest));
            window.open(`https://jifa.palmpay-inc.com?ar=${ar}`, '_blank', 'noopener,noreferrer');
          } else {
            this.toastUtil.onErrorToast('该任务暂不支持在线分析。');
          }
        },
        error: () => this.toastUtil.onErrorToast('获取分析请求失败'),
      });
  }

  /** UTF-8 safe base64 encoding. */
  private toBase64(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }

  /** Human-readable expiry, e.g. "5小时后过期" / "已过期". */
  expireText(expiredTime: string): string {
    if (!expiredTime) {
      return '-';
    }
    const diff = new Date(expiredTime).getTime() - Date.now();
    if (diff <= 0) {
      return 'Expired';
    }
    const mins = Math.floor(diff / 60000);
    if (mins < 60) {
      return 'Expires in ' + mins + (mins === 1 ? ' minute' : ' minutes');
    }
    const hours = Math.floor(mins / 60);
    if (hours < 24) {
      return 'Expires in ' + hours + (hours === 1 ? ' hour' : ' hours');
    }
    const days = Math.floor(hours / 24);
    return 'Expires in ' + days + (days === 1 ? ' day' : ' days');
  }

  /** A task is expired/unusable if it is invalid or its expiry time has passed. */
  isTaskExpired(task: OpsTaskVO): boolean {
    if (!task.valid) {
      return true;
    }
    if (!task.expiredTime) {
      return false;
    }
    return new Date(task.expiredTime).getTime() <= Date.now();
  }

  /** Human-readable file size, e.g. "1.2 MB". */
  humanFileSize(bytes: number | undefined): string {
    if (bytes == null || bytes <= 0) {
      return '';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let i = 0;
    while (value >= 1024 && i < units.length - 1) {
      value /= 1024;
      i++;
    }
    return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`;
  }

  /** Byte size of a WS payload: UTF-8 length for strings, exact for binary. */
  private wsByteLength(data: any): number {
    if (data == null) {
      return 0;
    }
    if (typeof data === 'string') {
      return new TextEncoder().encode(data).length;
    }
    if (data instanceof ArrayBuffer) {
      return data.byteLength;
    }
    if (typeof Blob !== 'undefined' && data instanceof Blob) {
      return data.size;
    }
    try {
      return new TextEncoder().encode(String(data)).length;
    } catch {
      return 0;
    }
  }

  /** Record an inbound WS message for the traffic meter. */
  private recordWsIn(data: any): void {
    this.wsBytesIn += this.wsByteLength(data);
    this.wsMsgIn++;
  }

  /** Send over the WS while accounting outbound bytes for the traffic meter. */
  private wsSend(data: string): void {
    this.wsBytesOut += this.wsByteLength(data);
    this.wsMsgOut++;
    this.ws?.send(data);
  }

  /** Sample the byte counters once per second to derive send/receive rates (bytes/s). */
  private startWsTrafficMeter(): void {
    timer(1000, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.wsRateIn = this.wsBytesIn - this.wsLastBytesIn;
        this.wsRateOut = this.wsBytesOut - this.wsLastBytesOut;
        this.wsLastBytesIn = this.wsBytesIn;
        this.wsLastBytesOut = this.wsBytesOut;
      });
  }

  /** Format bytes for the traffic meter (shows "0 B" instead of an empty string). */
  formatWsBytes(bytes: number): string {
    return this.humanFileSize(bytes) || '0 B';
  }

  private copyText(text: string, successMsg: string = '已复制') {
    const done = () => this.toastUtil.onSuccessToast(successMsg);
    const fail = () => this.toastUtil.onErrorToast('复制失败');
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => this.fallbackCopy(text, done, fail));
      return;
    }
    this.fallbackCopy(text, done, fail);
  }

  private fallbackCopy(text: string, done: () => void, fail: () => void) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) {
      fail();
    }
  }

  private initRouteParams(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
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
            this.queryParam.instanceName = param['instanceName'] !== undefined ? param['instanceName'] : '';

            const parma: QueryKubernetesDeploymentOptions = {
              applicationName: this.application.name,
              namespace: this.queryParam.namespace,
            };
            this.applicationResourceService.queryApplicationResourceKubernetesDeploymentOptions(parma)
              .subscribe(({ body }) => {
                this.resourceNameOptions = body.options;
              });

            this.fetchData();
          })
      } else {
        // 从 localStorage 恢复
        const savedApp = localStorage.getItem(KubernetesResourcesTabsComponent.APP_STORAGE_KEY);
        const savedNs = localStorage.getItem(KubernetesResourcesTabsComponent.NS_STORAGE_KEY);
        const savedCc = localStorage.getItem(KubernetesResourcesTabsComponent.CC_STORAGE_KEY);
        if (savedApp) {
          this.queryParam.applicationName = savedApp;
          this.applicationService.getApplicationByName({name: savedApp})
            .subscribe(({body}) => {
              this.application = body;
              this.isFavorite = this.application.favorited;
              this.queryParam.namespace = savedNs || '';
              this.queryParam.countryCode = savedCc || 'ng';
              if (!this.first) {
                this.first = true;
              }
              this.getResourceNamespaceOptions();

              if (savedNs) {
                const parma: QueryKubernetesDeploymentOptions = {
                  applicationName: this.application.name,
                  namespace: savedNs,
                };
                this.applicationResourceService.queryApplicationResourceKubernetesDeploymentOptions(parma)
                  .subscribe(({ body }) => {
                    this.resourceNameOptions = body.options;
                  });
              }

              this.fetchData();
            });
        }
      }
    });
  }

  onGetUserFavorite() {
    this.userFavoriteService.getMyFavoriteApplication()
      .pipe(takeUntil(this.destroy$))
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
      .pipe(takeUntil(this.destroy$))
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
      .pipe(takeUntil(this.destroy$))
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

  onGetShareUrl(): string {
    const origin = window.location.origin;
    let url =  origin + `/#/pages/workbench/kubernetes-resources?applicationName=${this.queryParam.applicationName}&namespace=${this.queryParam.namespace}`
    if (this.queryParam.name !== '') {
      url += `&name=${this.queryParam.name}`;
    }
    if (this.queryParam.instanceName !== '') {
      url += `&instanceName=${this.queryParam.instanceName}`;
    }
    return url;
  }

  fetchData() {
    this.show = false;
    this.kubernetesDetails = null;
    this.deploymentList = [];
    this.serviceList = [];
    this.kubernetesApplication = null;
    this.lastDeploymentsSignature = '';
    this.pendingDetails = null;
    if (this.queryParam.applicationName !== '' && this.queryParam.namespace !== '') {
      const param: QueryApplicationResourceKubernetesDetails = {
        ...this.queryParam,
      };
      this.loading = true;
      this.applicationResourceService.queryApplicationResourceKubernetesDetails(param)
        .pipe(
          takeUntil(this.destroy$),
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
        takeUntil(this.destroy$),
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
    localStorage.setItem(KubernetesResourcesTabsComponent.APP_STORAGE_KEY, application?.name || '');
    const currentNamespace = this.queryParam.namespace;
    this.wsOnUnsubSend();

    if (this.queryParam.applicationName) {
      this.applicationService.getMyResourceNamespaceOptions({ applicationName: application.name })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ body }) => {
          this.resourceNamespaceOptions = body.options;
          const namespaceExists = body.options.some(option => option.value === currentNamespace);

          if (namespaceExists) {
            this.queryParam.namespace = currentNamespace;
            // 获取对应namespace的resourceNameOptions
            const param: QueryKubernetesDeploymentOptions = {
              applicationName: application.name,
              namespace: currentNamespace,
            };
            this.applicationResourceService.queryApplicationResourceKubernetesDeploymentOptions(param)
              .pipe(takeUntil(this.destroy$))
              .subscribe(({ body }) => {
                this.resourceNameOptions = body.options;
              });
          } else {
            this.queryParam.namespace = '';
            this.resourceNameOptions = [];
          }

          this.queryParam.name = '';
          this.fetchData();
        });
    }
  }

  onSelectResourceName = (term) => {
    return of(
      this.resourceNameOptions
        .map((option, index) => ({ id: index, option: option }))
        .filter((item) => item.option.label.toLowerCase().indexOf(term.toLowerCase()) !== -1),
    );
  };

  onResourceNameChange(resourceName: any) {
    if (resourceName === null) {
      this.queryParam.name = '';
      this.queryParam.instanceName = '';
    } else {
      this.queryParam.name = resourceName['value'];
      this.queryParam.instanceName = resourceName['label'].split(':')[0];
    }
    this.wsOnUnsubSend();
    this.fetchData();
  }

  onResourceNamespaceChange(tab) {
    this.queryParam.namespace = tab;
    this.queryParam.countryCode = localStorage.getItem(KubernetesResourcesTabsComponent.CC_STORAGE_KEY) || 'ng';
    localStorage.setItem(KubernetesResourcesTabsComponent.NS_STORAGE_KEY, tab || '');
    this.queryParam.name = '';
    this.fetchData();
    const parma: QueryKubernetesDeploymentOptions = {
      applicationName: this.application.name,
      namespace: this.queryParam.namespace,
    };
    this.applicationResourceService.queryApplicationResourceKubernetesDeploymentOptions(parma)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ body }) => {
        this.resourceNameOptions = body.options;
      });
  }

  onCountryCodeChange() {
    localStorage.setItem(KubernetesResourcesTabsComponent.CC_STORAGE_KEY, this.queryParam.countryCode || '');
    this.fetchData();
  }

  /** Persist the user-forced compact (mobile) layout preference. */
  onForceMobileChange() {
    localStorage.setItem(KubernetesResourcesTabsComponent.FM_STORAGE_KEY, this.forceMobile ? 'true' : 'false');
  }

  getResourceNamespaceOptions() {
    this.nameSpaceLoading = true;
    this.queryParam.name = '';
    this.resourceNameOptions = [];
    this.applicationService.getMyResourceNamespaceOptions({ applicationName: this.application.name })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.nameSpaceLoading = false;
        }),
      ).subscribe(
      ({ body }) => this.resourceNamespaceOptions = body.options);
  };

  wsOnInit() {
    this.ws = this.wsApiService.createWsClient('/application/kubernetes/details');
    this.wsStatus = 'connecting';
    this.ws.onerror = () => {
      this.wsStatus = 'closed';
    };
    this.ws.onclose = () => {
      this.wsStatus = 'closed';
    };
  }

  onWsHeartbeat() {
    this.wsHeartbeatTimerRequest = timer(5000, WS_HEART_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(num => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.wsApiService.onPing(this.ws);
          // Ping is an empty frame (~0 payload bytes); count it as one outbound message.
          this.wsMsgOut++;
        }
      });
  }

  /** Close the WS when the tab becomes hidden, and reconnect when it is visible again. */
  private onVisibilityChange() {
    if (document.hidden) {
      this.pageHidden = true;
      this.pendingDetails = null;
      this.closeWsConnection();
    } else {
      if (!this.pageHidden) {
        return;
      }
      this.pageHidden = false;
      this.closeWsConnection();
      this.wsOnInit();
      this.wsOnOpen();
    }
  }

  ngOnInit(): void {
    this.wsOnInit();
    this.wsOnOpen();
    this.initInterval();
    this.onWsHeartbeat();
    this.startWsTrafficMeter();
    this.initRouteParams();
    this.onGetUserFavorite();
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  /** Tear down only the WebSocket connection (keeps reconnect/heartbeat timers running). */
  private closeWsConnection() {
    try {
      if (this.ws) {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        if (this.ws.readyState === WebSocket.OPEN ||
          this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close();
        }
        this.ws = null;
      }
    } catch (error) {
    }
    this.wsStatus = 'closed';
  }

  wsOnClose() {
    if (this.timerRequest) {
      this.timerRequest.unsubscribe();
      this.timerRequest = null;
    }
    if (this.wsHeartbeatTimerRequest) {
      this.wsHeartbeatTimerRequest.unsubscribe();
      this.wsHeartbeatTimerRequest = null;
    }
    this.closeWsConnection();
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.destroy$.next();
    this.destroy$.complete();
    this.wsOnClose();
    localStorage.removeItem('kubernetes_resources');
    localStorage.removeItem('kubernetes_resources_version');
  }

  initInterval() {
    this.timerRequest = timer(1000, WS_INIT_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(num => {
        if (this.pageHidden) {
          return;
        }
        if (this.ws?.readyState !== WebSocket.OPEN
          && this.ws?.readyState !== WebSocket.CONNECTING
          && this.ws?.readyState !== WebSocket.CLOSING) {
          // Only rebuild the socket; keep the reconnect/heartbeat timers alive.
          this.closeWsConnection();
          this.wsOnInit();
          this.wsOnOpen();
        }
      });
  }

  wsOnOpen() {
    this.ws.onopen = (event) => {
      this.wsStatus = 'connected';
      // (Re)subscribe and (re)bind the message handler whenever the socket opens,
      // so reconnects resume the data stream with the current query params.
      this.wsOnSubSend();
      this.wsOnMessage();
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
        instanceName: this.queryParam.instanceName,
        applicationName: this.queryParam.applicationName,
        namespace: this.queryParam.namespace,
        name: this.queryParam.name,
        countryCode: this.queryParam.countryCode,
      };
      this.wsSend(JSON.stringify(param));
    }
  }

  wsOnUnsubSend() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const param: ApplicationKubernetesDetailsRequest = {
        topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_DETAILS,
        action: WsMessageActionEnum.UNSUBSCRIBE,
      };
      this.wsSend(JSON.stringify(param));
    }
  }

  wsOnMessage() {
    this.ws.onmessage = (event) => {
      this.recordWsIn(event.data);
      const msg: MessageResponse<KubernetesDetailsVO> = JSON.parse(event.data);
      if (msg.topic === WsMessageTopicEnum.APPLICATION_KUBERNETES_DETAILS) {
        if (msg.body.success) {
          if (msg.body.application.name === this.queryParam.applicationName
            && msg.body.namespace === this.queryParam.namespace) {
            // Buffer the latest payload and flush on a throttle to avoid
            // re-rendering the whole workloads tree on every server push.
            this.pendingDetails = msg.body;
            this.scheduleDetailsFlush();
          }
        } else {
          this.wsOnUnsubSend();
        }
      }
    };
  }

  /** Apply the buffered details payload at most once per throttle window. */
  private scheduleDetailsFlush() {
    if (this.detailsFlushScheduled) {
      return;
    }
    this.detailsFlushScheduled = true;
    const elapsed = Date.now() - this.lastDetailsAppliedAt;
    const delay = Math.max(0, KubernetesResourcesTabsComponent.DETAILS_THROTTLE_MS - elapsed);
    timer(delay)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.detailsFlushScheduled = false;
        this.lastDetailsAppliedAt = Date.now();
        const details = this.pendingDetails;
        this.pendingDetails = null;
        if (details) {
          this.applyDetails(details);
        }
      });
  }

  private applyDetails(details: KubernetesDetailsVO) {
    const newDeployments = details?.workloads?.deployments;
    // Skip if nothing actually changed, to avoid redundant change detection.
    const signature = this.buildDeploymentsSignature(newDeployments);
    const sameDeployments = signature === this.lastDeploymentsSignature;

    this.kubernetesDetails = details;
    this.serviceList = this.kubernetesDetails?.network?.services;
    this.kubernetesApplication = this.kubernetesDetails?.application;
    this.show = true;

    try {
      if (newDeployments && this.deploymentList?.length > 0) {
        const oldMap = new Map(this.deploymentList.map(d => [d.metadata.name + '@' + d.kubernetesCluster.name, d]));
        newDeployments.forEach(d => {
          const old = oldMap.get(d.metadata.name + '@' + d.kubernetesCluster.name);
          if (old?.replicaSets && !d.replicaSets) {
            const runningPods = d.pods?.filter(p => p.status?.phase === 'Running').length ?? 0;
            const desiredReplicas = d.spec?.replicas ?? 0;
            d.replicaSets = old.replicaSets.map(rs => ({
              ...rs,
              readyReplicas: runningPods,
              replicas: desiredReplicas,
              progressing: desiredReplicas !== runningPods,
            }));
          }
        });
      }
    } catch (e) {
      console.warn('replicaSets merge error:', e);
    }

    if (sameDeployments) {
      // Keep the existing array reference so trackBy can fully reuse the views.
      return;
    }
    this.lastDeploymentsSignature = signature;
    if (this.queryParam.name !== '' && this.queryParam.name !== null) {
      this.deploymentList = newDeployments?.filter(
        deployment => deployment.metadata.name === this.queryParam.name,
      );
    } else {
      this.deploymentList = newDeployments;
    }
  }

  /** Lightweight signature of deployments to detect real changes (avoids full deep compare). */
  private buildDeploymentsSignature(deployments: any[]): string {
    if (!deployments?.length) {
      return '';
    }
    return deployments.map(d => {
      const pods = (d.pods || []).map(p =>
        p.metadata?.name + ':' + (p.status?.phase || '') + ':' +
        (p.containerStatuses || []).map(c => (c.ready ? '1' : '0') + (c.restartCount ?? '')).join(',')).join('|');
      return d.metadata?.name + '@' + d.kubernetesCluster?.name + '#' + (d.spec?.replicas ?? '') + '#' + pods;
    }).join(';;');
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
