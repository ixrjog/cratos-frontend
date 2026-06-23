import { Component, OnDestroy, OnInit } from '@angular/core';
import { KubernetesNodeDetailsVO, KubernetesNodeVO } from '../../../../@core/data/kubernetes';
import { finalize, Subscription, timer } from 'rxjs';
import { WebSocketApiService } from '../../../../@core/services/ws.api.service';
import { ToastUtil } from '../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { EdsService } from '../../../../@core/services/ext-datasource.service.s';
import { EdsInstanceVO, InstancePageQuery } from '../../../../@core/data/ext-datasource';
import { QueryKubernetesNodeDetails } from '../../../../@core/data/ext-datasource-kubernetes';
import { EdsKubernetesService } from '../../../../@core/services/ext-datasource-kubernetes.service';
import { WS_HEART_INTERVAL } from '../../../../@shared/constant/ws.constant';

@Component({
  selector: 'app-kubernetes-nodes-data',
  templateUrl: './kubernetes-nodes-data.component.html',
  styleUrls: [ './kubernetes-nodes-data.component.less' ],
})
export class KubernetesNodesDataComponent implements OnInit, OnDestroy {

  private static readonly INSTANCE_STORAGE_KEY = 'k8s_nodes_selected_instance';

  queryParam = {
    instanceName: '',
  };

  kubernetesInstance: EdsInstanceVO;
  show = false;
  loading = false;
  kubernetesNodeDetailsVO: KubernetesNodeDetailsVO = null;
  kubernetesNodes: Map<string, KubernetesNodeVO[]>;
  /** Result after applying the client-side node filters. */
  filteredNodes: Map<string, KubernetesNodeVO[]> = new Map();
  /** Client-side only filters. */
  nodeFilter = {
    ip: '',
    cpuOverload: false,
    memOverload: false,
  };

  ws: WebSocket;
  timerRequest: Subscription;
  wsHeartbeatTimerRequest: Subscription;

  constructor(
    private kubernetesResourceService: EdsKubernetesService,
    private edsService: EdsService,
    private wsApiService: WebSocketApiService,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: QueryKubernetesNodeDetails = {
      ...this.queryParam,
    };
    this.kubernetesNodeDetailsVO = null;
    this.show = false;
    this.loading = true;
    this.kubernetesResourceService.queryKubernetesNodeDetails(param)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(
      ({ body }) => {
        if (body.body.success) {
          this.kubernetesNodeDetailsVO = body.body;
          this.kubernetesNodes = new Map(Object.entries(this.kubernetesNodeDetailsVO.nodes));
          this.applyNodeFilter();
          this.show = true;
        } else {
          this.toastUtil.onErrorToast(body.body.message, { width: '600px' });
        }
      },
    );
    // this.wsOnSubSend();
    // this.wsOnMessage();
  }

  onNodeFilterChange() {
    this.applyNodeFilter();
  }

  /** Apply node IP / CPU>60% / MEM>80% filters in the browser; drop zones with no matching node. */
  applyNodeFilter() {
    const ip = (this.nodeFilter.ip || '').trim().toLowerCase();
    const result = new Map<string, KubernetesNodeVO[]>();
    this.kubernetesNodes?.forEach((nodes, zone) => {
      const matched = (nodes || []).filter(node => {
        if (ip) {
          const addresses: any = node.status?.addresses || {};
          const internalIp = (addresses['InternalIP']?.address || '').toLowerCase();
          const hostname = (addresses['Hostname']?.address || '').toLowerCase();
          if (!internalIp.includes(ip) && !hostname.includes(ip)) {
            return false;
          }
        }
        if (this.nodeFilter.cpuOverload && !(node.usage?.cpuPercentage > 60)) {
          return false;
        }
        if (this.nodeFilter.memOverload && !(node.usage?.memoryPercentage > 80)) {
          return false;
        }
        return true;
      });
      if (matched.length > 0) {
        result.set(zone, matched);
      }
    });
    this.filteredNodes = result;
  }

  onSearchKubernetesInstance = (term: string) => {
    const param: InstancePageQuery = {
      length: 10, page: 1, queryName: term, edsType: 'KUBERNETES',
    };
    return this.edsService.queryEdsInstancePage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((instance, index) => ({ id: index, option: instance })),
        ),
      );
  };

  onKubernetesInstanceChange(instance: EdsInstanceVO) {
    this.queryParam.instanceName = instance?.instanceName;
    if (instance?.instanceName) {
      localStorage.setItem(KubernetesNodesDataComponent.INSTANCE_STORAGE_KEY, instance.instanceName);
    } else {
      localStorage.removeItem(KubernetesNodesDataComponent.INSTANCE_STORAGE_KEY);
    }
    this.fetchData();
    // this.wsOnUnsubSend();
  }

  wsOnInit() {
    // this.ws = this.wsApiService.createWsClient('/eds/kubernetes/node');
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
    const saved = localStorage.getItem(KubernetesNodesDataComponent.INSTANCE_STORAGE_KEY);
    if (saved) {
      this.queryParam.instanceName = saved;
      this.kubernetesInstance = { instanceName: saved } as EdsInstanceVO;
      this.fetchData();
    }
    // this.wsOnInit();
    // this.wsOnOpen();
    // this.initInterval();
    // this.onWsHeartbeat();
  }

  ngOnDestroy(): void {
    // try {
    //   this.timerRequest.unsubscribe();
    //   this.wsHeartbeatTimerRequest.unsubscribe();
    //   this.ws.close();
    //   this.ws = null;
    // } catch (error) {
    // }
  }

  // initInterval() {
  //   this.timerRequest = timer(1000, WS_INIT_INTERVAL)
  //     .subscribe(num => {
  //        if (this.ws?.readyState !== WebSocket.OPEN
  //           && this.ws?.readyState !== WebSocket.CONNECTING
  //           && this.ws?.readyState !== WebSocket.CLOSING) {
  //         this.wsOnInit();
  //         this.wsOnOpen();
  //         this.wsOnSubSend();
  //         this.wsOnMessage();
  //       }
  //     });
  // }
  //
  // wsOnOpen() {
  //   this.ws.onopen = (event) => {
  //   };
  // }
  //
  // wsOnSubSend() {
  //   if (this.ws?.readyState === WebSocket.OPEN) {
  //     const param: EdsKubernetesNodeDetailsRequest = {
  //       topic: WsMessageTopicEnum.EDS_KUBERNETES_NODE_DETAILS,
  //       action: WsMessageActionEnum.SUBSCRIPTION,
  //       instanceName: this.queryParam.instanceName,
  //     };
  //     this.ws.send(JSON.stringify(param));
  //   }
  // }
  //
  // wsOnUnsubSend() {
  //   if (this.ws?.readyState === WebSocket.OPEN) {
  //     const param: EdsKubernetesNodeDetailsRequest = {
  //       topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_DETAILS,
  //       action: WsMessageActionEnum.UNSUBSCRIBE,
  //     };
  //     this.ws.send(JSON.stringify(param));
  //   }
  // }
  //
  // wsOnMessage() {
  //   this.ws.onmessage = (event) => {
  //     const msg: MessageResponse<KubernetesNodeDetailsVO> = JSON.parse(event.data);
  //     if (msg.topic === WsMessageTopicEnum.EDS_KUBERNETES_NODE_DETAILS) {
  //       if (msg.body.success) {
  //           this.kubernetesNodeDetailsVO = msg.body;
  //       } else {
  //         this.wsOnUnsubSend();
  //       }
  //     }
  //   };
  // }

}
