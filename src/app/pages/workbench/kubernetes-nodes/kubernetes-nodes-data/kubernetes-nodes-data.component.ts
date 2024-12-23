import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationVO } from '../../../../@core/data/application';
import { KubernetesNodeDetailsVO, KubernetesNodeVO } from '../../../../@core/data/kubernetes';
import { finalize, Subscription, timer } from 'rxjs';
import { WebSocketApiService } from '../../../../@core/services/ws.api.service';
import { ToastUtil } from '../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { EdsService } from '../../../../@core/services/ext-datasource.service.s';
import { EdsInstanceVO, InstancePageQuery } from '../../../../@core/data/ext-datasource';
import { QueryKubernetesNodeDetails } from '../../../../@core/data/ext-datasource-kubernetes';
import { EdsKubernetesService } from '../../../../@core/services/ext-datasource-kubernetes.service';

@Component({
  selector: 'app-kubernetes-nodes-data',
  templateUrl: './kubernetes-nodes-data.component.html',
  styleUrls: [ './kubernetes-nodes-data.component.less' ],
})
export class KubernetesNodesDataComponent implements OnInit, OnDestroy {

  queryParam = {
    instanceName: '',
  };

  KubernetesInstance: EdsInstanceVO;
  show = false;
  loading = false;
  kubernetesNodeDetailsVO: KubernetesNodeDetailsVO = null;
  kubernetesNodes: Map<string, KubernetesNodeVO[]>;

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
          this.show = true;
        } else {
          this.toastUtil.onErrorToast(body.body.message, { width: '600px' });
        }
      },
    );
    // this.wsOnSubSend();
    // this.wsOnMessage();
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
    this.fetchData();
    // this.wsOnUnsubSend();
  }

  wsOnInit() {
    this.ws = this.wsApiService.createWsClient('/application/kubernetes/details');
  }

  onWsHeartbeat() {
    this.timerRequest = timer(5000, 10000)
      .subscribe(num => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.wsApiService.onPing(this.ws);
        }
      });
  }

  ngOnInit(): void {
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
  //   this.timerRequest = timer(1000, 1000)
  //     .subscribe(num => {
  //       if (this.ws?.readyState !== WebSocket.OPEN) {
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
  //     const param: ApplicationKubernetesDetailsRequest = {
  //       topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_DETAILS,
  //       action: WsMessageActionEnum.SUBSCRIPTION,
  //       instanceName: this.queryParam.instanceName,
  //     };
  //     this.ws.send(JSON.stringify(param));
  //   }
  // }
  //
  // wsOnUnsubSend() {
  //   if (this.ws?.readyState === WebSocket.OPEN) {
  //     const param: ApplicationKubernetesDetailsRequest = {
  //       topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_DETAILS,
  //       action: WsMessageActionEnum.UNSUBSCRIBE,
  //     };
  //     this.ws.send(JSON.stringify(param));
  //   }
  // }
  //
  // wsOnMessage() {
  //   this.ws.onmessage = (event) => {
  //     const msg: MessageResponse<KubernetesDetailsVO> = JSON.parse(event.data);
  //     if (msg.topic === WsMessageTopicEnum.APPLICATION_KUBERNETES_DETAILS) {
  //       if (msg.body.success) {
  //           this.kubernetesNodeDetailsVO = msg.body;
  //       } else {
  //         this.wsOnUnsubSend();
  //       }
  //     }
  //   };
  // }

}
