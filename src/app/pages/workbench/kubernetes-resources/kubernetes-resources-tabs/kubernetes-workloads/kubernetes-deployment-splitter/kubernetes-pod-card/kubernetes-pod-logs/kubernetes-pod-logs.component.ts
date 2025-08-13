import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { KubernetesDeploymentVO, KubernetesPodVO } from '../../../../../../../../@core/data/kubernetes';
import { XtermLogsComponent } from '../../../../../../../../@shared/components/common/xterm-logs/xterm-logs.component';
import { Subscription, timer, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
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
import { WS_HEART_INTERVAL } from '../../../../../../../../@shared/constant/ws.constant';

@Component({
  selector: 'app-kubernetes-pod-logs',
  templateUrl: './kubernetes-pod-logs.component.html',
  styleUrls: ['./kubernetes-pod-logs.component.less'],
})
export class KubernetesPodLogsComponent implements OnInit, OnDestroy {
  @ViewChild('kubernetesPodLog') private kubernetesPodLog: XtermLogsComponent;
  @Input() data: any;

  // 组件销毁信号
  private destroy$ = new Subject<void>();

  // 组件属性
  uuid: string;
  instanceId: string;
  kubernetesPod: KubernetesPodVO;
  kubernetesDeployment: KubernetesDeploymentVO;
  containerName: string;
  application: ApplicationVO;
  closeHandler: Function;

  // WebSocket相关
  private ws: WebSocket | null = null;
  private heartbeatSubscription: Subscription | null = null;
  private lastHeartbeatTime: number = 0;
  private readonly HEARTBEAT_TIMEOUT = 30000; // 30秒超时检测

  constructor(
    private wsApiService: WebSocketApiService,
    private uuidUtil: UuidUtil
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    this.initializeWebSocket();
    this.startHeartbeat();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanup();
  }

  private initializeComponent(): void {
    this.closeHandler = this.data['closeHandler'];
    this.kubernetesPod = this.data['kubernetesPod'];
    this.kubernetesDeployment = this.data['kubernetesDeployment'];
    this.containerName = this.data['containerName'];
    this.application = this.data['application'];

    this.uuid = this.uuidUtil.uuid(8, 10);
    this.instanceId = this.kubernetesPod.metadata.name + '#' + this.uuid;
  }

  private initializeWebSocket(): void {
    try {
      this.ws = this.wsApiService.createWsClient('/ssh/kubernetes');
      this.setupWebSocketEventHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }

  private setupWebSocketEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      console.log('WebSocket connected for logs');
      this.lastHeartbeatTime = Date.now();
      this.startLogWatch();
    };

    this.ws.onmessage = (event) => {
      this.handleWebSocketMessage(event);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      if (event.code !== 1000) { // 非正常关闭
        console.warn('WebSocket connection closed unexpectedly');
      }
    };
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      // 空消息作为心跳响应
      if (!event.data || event.data === '') {
        this.lastHeartbeatTime = Date.now();
        return;
      }

      const msgList: SessionOutput[] = JSON.parse(event.data);
      msgList
        .filter(msg => msg.instanceId === this.instanceId)
        .forEach(msg => {
          if (msg.errorMsg === null && msg.output) {
            if (this.kubernetesPodLog) {
              this.kubernetesPodLog.onWrite(msg.output);
            }
          } else if (msg.errorMsg) {
            console.error('Log session error:', msg.errorMsg);
          }
        });
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private startHeartbeat(): void {
    // 延迟5秒开始心跳，然后每15秒发送一次
    this.heartbeatSubscription = timer(5000, WS_HEART_INTERVAL)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.ws?.readyState === WebSocket.OPEN)
      )
      .subscribe(() => {
        this.sendHeartbeat();
      });
  }

  private sendHeartbeat(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.wsApiService.onPing(this.ws);
      } catch (error) {
        console.error('Failed to send heartbeat:', error);
      }
    }
  }

  private startLogWatch(): void {
    const param: ApplicationKubernetesDetailsRequest = {
      topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_POD_WATCH_LOG,
      action: WsMessageActionEnum.WATCH,
      applicationName: this.application.name,
      namespace: this.kubernetesDeployment.metadata.namespace,
      deployments: [],
    };

    const deployment: ApplicationKubernetesDeploymentRequest = {
      kubernetesClusterName: this.kubernetesDeployment.kubernetesCluster.name,
      name: this.kubernetesDeployment.metadata.name,
      pods: [],
    };

    const pod: ApplicationKubernetesPodRequest = {
      instanceId: this.instanceId,
      name: this.kubernetesPod.metadata.name,
      namespace: this.kubernetesPod.metadata.namespace,
      container: {
        name: this.containerName,
      },
    };

    deployment.pods.push(pod);
    param.deployments.push(deployment);

    this.sendWebSocketMessage(param);
  }

  private sendWebSocketMessage(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
      }
    }
  }

  private cleanup(): void {
    // 清理心跳订阅
    if (this.heartbeatSubscription) {
      this.heartbeatSubscription.unsubscribe();
      this.heartbeatSubscription = null;
    }

    // 清理WebSocket
    if (this.ws) {
      // 清理事件处理器，防止内存泄露
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;

      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        try {
          this.ws.close(1000, 'Component destroyed');
        } catch (error) {
          console.error('Error closing WebSocket:', error);
        }
      }
      this.ws = null;
    }
  }

  // 公共方法
  onRowExit(): void {
    this.cleanup();
    if (this.closeHandler) {
      this.closeHandler();
    }
  }

}
