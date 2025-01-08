import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { KubernetesDeploymentVO, KubernetesPodVO } from '../../../../../../../../@core/data/kubernetes';
import { XtermLogsComponent } from '../../../../../../../../@shared/components/common/xterm-logs/xterm-logs.component';
import { OutputMessage } from '../../../../../../../../@core/data/ssh-session';
import { Subscription, timer } from 'rxjs';
import {
  WebSocketApiService,
  WsMessageActionEnum,
  WsMessageTopicEnum,
} from '../../../../../../../../@core/services/ws.api.service';
import { ToastUtil } from '../../../../../../../../@shared/utils/toast.util';
import { ApplicationVO } from '../../../../../../../../@core/data/application';
import {
  ApplicationKubernetesDeploymentRequest,
  ApplicationKubernetesDetailsRequest,
  ApplicationKubernetesPodRequest,
} from '../../../../../../../../@core/data/kubernetes-resource';

@Component({
  selector: 'app-kubernetes-pod-logs',
  templateUrl: './kubernetes-pod-logs.component.html',
  styleUrls: [ './kubernetes-pod-logs.component.less' ],
})
export class KubernetesPodLogsComponent implements OnInit, OnDestroy {

  @ViewChild('kubernetesPodLog') private kubernetesPodLog: XtermLogsComponent;

  @Input() data: any;

  kubernetesPod: KubernetesPodVO;
  kubernetesDeployment: KubernetesDeploymentVO;
  containerName: string;
  application: ApplicationVO;

  ws: WebSocket;
  timerRequest: Subscription;
  wsHeartbeatTimerRequest: Subscription;

  constructor(private wsApiService: WebSocketApiService,
              private toastUtil: ToastUtil) {
  }

  wsOnInit() {
    this.ws = this.wsApiService.createWsClient('/ssh/kubernetes');
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
    this.wsOnInit();
    this.wsOnOpen();
    this.wsOnMessage();
    this.kubernetesPod = this.data['kubernetesPod'];
    this.kubernetesDeployment = this.data['kubernetesDeployment'];
    this.containerName = this.data['containerName'];
    this.application = this.data['application'];
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
  }

  initInterval() {
    this.timerRequest = timer(1000, 1000)
      .subscribe(num => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
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
      topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_WATCH_LOG,
      action: WsMessageActionEnum.SUBSCRIPTION,
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
      instanceId: this.kubernetesPod.metadata.name,
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
      let msg: OutputMessage = JSON.parse(event.data);
      if (msg.code === 0) {
        this.kubernetesPodLog.onWrite(msg.output);
        return;
      }
      this.toastUtil.onErrorToast(msg.error, { width: '600px' });
    };
  }

}
