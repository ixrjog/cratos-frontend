import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { KubernetesDeploymentVO, KubernetesPodVO } from '../../../../../../../../@core/data/kubernetes';
import { ApplicationVO } from '../../../../../../../../@core/data/application';
import { Subscription, timer } from 'rxjs';
import {
  WebSocketApiService,
  WsMessageActionEnum,
  WsMessageTopicEnum,
} from '../../../../../../../../@core/services/ws.api.service';
import { UuidUtil } from '../../../../../../../../@shared/utils/uuid.util';
import { WS_HEART_INTERVAL, WS_INIT_INTERVAL } from '../../../../../../../../@shared/constant/ws.constant';
import {
  ApplicationKubernetesDeploymentRequest,
  ApplicationKubernetesDetailsRequest,
  ApplicationKubernetesPodRequest,
} from '../../../../../../../../@core/data/kubernetes-resource';
import { SessionOutput } from '../../../../../../../../@core/data/ssh-terminal';
import { ITerminalOptions, Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { BASE_TERMINAL_OPTIONS } from '../../../../../../../../@shared/constant/xterm.constant';
import { getRowColor } from '../../../../../../../../@shared/utils/data-table.utli';

@Component({
  selector: 'app-kubernetes-pod-exec',
  templateUrl: './kubernetes-pod-exec.component.html',
  styleUrls: [ './kubernetes-pod-exec.component.less' ],
})
export class KubernetesPodExecComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() data: any;
  uuid: string;
  instanceId: string;

  feedLines = 24;
  rows: number = 40;
  kubernetesPod: KubernetesPodVO;
  kubernetesDeployment: KubernetesDeploymentVO;
  containerName: string;
  application: ApplicationVO;
  closeHandler: Function;

  ws: WebSocket;
  timerRequest: Subscription;
  wsHeartbeatTimerRequest: Subscription;
  terminal: Terminal;
  fitAddon = new FitAddon();
  webLinksAddon = new WebLinksAddon();
  baseTerminalOptions: ITerminalOptions = BASE_TERMINAL_OPTIONS;

  constructor(private wsApiService: WebSocketApiService,
              private uuidUtil: UuidUtil) {
    this.terminal = new Terminal(this.baseTerminalOptions);
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(this.webLinksAddon);
  }

  wsOnInit() {
    this.uuid = this.uuidUtil.uuid(8, 10);
    this.instanceId = this.kubernetesPod.metadata.name + '#' + this.uuid;
    this.ws = this.wsApiService.createWsClient('/ssh/kubernetes');
  }

  ngAfterViewInit(): void {
    this.terminal.open(document.getElementById('kubernetesPodExec'));
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
    this.closeHandler = this.data['closeHandler'];
    this.kubernetesPod = this.data['kubernetesPod'];
    this.kubernetesDeployment = this.data['kubernetesDeployment'];
    this.containerName = this.data['containerName'];
    this.application = this.data['application'];
    this.wsOnInit();
    this.wsOnOpen();
    this.wsOnMessage();
    this.initInterval();
    this.onWsHeartbeat();
  }

  ngOnDestroy(): void {
    this.onDestroy()
  }

  initInterval() {
    this.timerRequest = timer(1000, WS_INIT_INTERVAL)
      .subscribe(num => {
        if (this.ws?.readyState !== WebSocket.OPEN
          && this.ws?.readyState !== WebSocket.CONNECTING
          && this.ws?.readyState !== WebSocket.CLOSING) {
          this.wsOnInit();
          this.wsOnOpen();
          this.wsOnMessage();
        }
      });
  }

  wsOnOpen() {
    this.ws.onopen = (event) => {
      try {
        this.wsOnExec();
        this.wsOnInput();
      } catch (error) {
      }
    };
  }

  wsOnExec() {
    this.fitAddon.fit();
    const defaultRows = this.rows;
    const defaultCols = this.terminal.cols;
    this.terminal.resize(defaultCols, Math.min(defaultRows, this.feedLines));
    this.terminal.onLineFeed(() => {
      this.feedLines++;
      this.terminal.resize(
        defaultCols,
        Math.min(defaultRows, this.feedLines),
      );
    });
    let param: ApplicationKubernetesDetailsRequest = {
      topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_POD_EXEC,
      action: WsMessageActionEnum.EXEC,
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
      terminal: {
        cols: defaultCols,
        rows: defaultRows,
      },
    };
    deployment.pods.push(pod);
    param.deployments.push(deployment);
    this.ws.send(JSON.stringify(param));
  }

  wsOnInput() {
    this.terminal.onData((event) => {
      let param: ApplicationKubernetesDetailsRequest = {
        topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_POD_EXEC,
        action: WsMessageActionEnum.INPUT,
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
        input: event,
      };
      deployment.pods.push(pod);
      param.deployments.push(deployment);
      this.ws.send(JSON.stringify(param));
    });
  }

  wsOnResize() {
    this.fitAddon.fit();
    const defaultRows = this.rows;
    const defaultCols = this.terminal.cols;
    this.terminal.resize(defaultCols, Math.min(defaultRows, this.feedLines));
    this.terminal.onLineFeed(() => {
      this.feedLines++;
      this.terminal.resize(
        defaultCols,
        Math.min(defaultRows, this.feedLines),
      );
    });
    let param: ApplicationKubernetesDetailsRequest = {
      topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_POD_EXEC,
      action: WsMessageActionEnum.RESIZE,
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
      terminal: {
        cols: defaultCols,
        rows: defaultRows,
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
            this.terminal.write(msg.output);
          }
        });
    };
  }

  onResize(event) {
    this.wsOnResize();
  }

  onDestroy(): void {
    try {
      if (this.terminal) {
        this.terminal.dispose();
      }
      if (this.timerRequest) {
        this.timerRequest.unsubscribe();
      }
      if (this.wsHeartbeatTimerRequest) {
        this.wsHeartbeatTimerRequest.unsubscribe();
      }
      this.ws.close(1000, 'user exit');
      this.ws = null;
    } catch (error) {
    }
  }

  onRowExit() {
    this.onDestroy()
    this.closeHandler();
  }

  protected readonly getRowColor = getRowColor;
}
