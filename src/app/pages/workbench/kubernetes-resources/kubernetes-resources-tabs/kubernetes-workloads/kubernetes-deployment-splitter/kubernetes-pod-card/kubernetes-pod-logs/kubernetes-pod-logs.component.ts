import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { KubernetesDeploymentVO, KubernetesPodVO } from '../../../../../../../../@core/data/kubernetes';
import { XtermLogsComponent } from '../../../../../../../../@shared/components/common/xterm-logs/xterm-logs.component';
import { Subscription, timer } from 'rxjs';
import {
  WebSocketApiService,
  WsMessageActionEnum,
  WsMessageTopicEnum,
} from '../../../../../../../../@core/services/ws.api.service';
import { ApplicationVO } from '../../../../../../../../@core/data/application';
import {
  ApplicationKubernetesDeploymentRequest,
  ApplicationKubernetesDetailsRequest,
  ApplicationKubernetesPodRequest,
} from '../../../../../../../../@core/data/kubernetes-resource';
import { SessionOutput } from '../../../../../../../../@core/data/ssh-terminal';
import { UuidUtil } from '../../../../../../../../@shared/utils/uuid.util';
import { WS_HEART_INTERVAL, WS_INIT_INTERVAL } from '../../../../../../../../@shared/constant/ws.constant';

@Component({
  selector: 'app-kubernetes-pod-logs',
  templateUrl: './kubernetes-pod-logs.component.html',
  styleUrls: [ './kubernetes-pod-logs.component.less' ],
})
export class KubernetesPodLogsComponent implements OnInit, OnDestroy {

  @ViewChild('kubernetesPodLog') private kubernetesPodLog: XtermLogsComponent;
  @Input() data: any;
  uuid: string;
  instanceId: string;

  kubernetesPod: KubernetesPodVO;
  kubernetesDeployment: KubernetesDeploymentVO;
  containerName: string;
  application: ApplicationVO;

  ws: WebSocket;
  timerRequest: Subscription;
  wsHeartbeatTimerRequest: Subscription;

  constructor(private wsApiService: WebSocketApiService,
              private uuidUtil: UuidUtil) {
  }

  wsOnInit() {
    this.ws = this.wsApiService.createWsClient('/ssh/kubernetes');
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
    this.wsOnMessage();
    this.kubernetesPod = this.data['kubernetesPod'];
    this.kubernetesDeployment = this.data['kubernetesDeployment'];
    this.containerName = this.data['containerName'];
    this.application = this.data['application'];
    this.initInterval();
    this.onWsHeartbeat();
    this.uuid = this.uuidUtil.uuid(8, 10);
    this.instanceId = this.kubernetesPod.metadata.name + '#' + this.uuid
  }

  ngOnDestroy(): void {
    try {
      this.timerRequest.unsubscribe();
      this.wsHeartbeatTimerRequest.unsubscribe();
      this.ws.close();
      this.ws = null;
    } catch (error) {
    }
  }

  initInterval() {
    this.timerRequest = timer(1000, WS_INIT_INTERVAL)
      .subscribe(num => {
        console.log(this.ws.readyState);
        if (this.ws?.readyState !== WebSocket.OPEN && this.ws?.readyState !== WebSocket.CONNECTING) {
          this.wsOnInit();
          this.wsOnOpen();
          this.wsOnMessage();
        }
      });
  }

  wsOnOpen() {
    this.ws.onopen = (event) => {
      try {
        this.wsOnSend();
      } catch (error) {
      }
    };
  }

  wsOnSend() {
    let param: ApplicationKubernetesDetailsRequest = {
      topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_POD_WATCH_LOG,
      action: WsMessageActionEnum.WATCH,
      applicationName: this.application.name,
      namespace: this.kubernetesDeployment.metadata.namespace,
      deployments: [],
    };
    let deployment: ApplicationKubernetesDeploymentRequest = {
      kubernetesClusterName: this.kubernetesDeployment.kubernetesCluster.name,
      name: this.kubernetesDeployment.metadata.name,
      pods: [],
    };
    let pod: ApplicationKubernetesPodRequest = {
      instanceId: this.instanceId,
      name: this.kubernetesPod.metadata.name,
      namespace: this.kubernetesPod.metadata.namespace,
      container: {
        name: this.containerName,
      },
    };
    deployment.pods.push(pod);
    param.deployments.push(deployment);
    this.ws.send(JSON.stringify(param));
  }

  wsOnMessage() {
    this.ws.onmessage = (event) => {
      let msgList: SessionOutput[] = JSON.parse(event.data);
      msgList
        .filter(msg => msg.instanceId === this.instanceId)
        .map(msg => {
          if (msg.errorMsg === null) {
            this.kubernetesPodLog.onWrite(msg.output);
          }
        });
    };
  }

}
