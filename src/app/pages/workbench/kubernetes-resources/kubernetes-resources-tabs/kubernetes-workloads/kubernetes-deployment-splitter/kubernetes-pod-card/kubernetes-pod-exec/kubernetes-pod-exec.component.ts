import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { KubernetesDeploymentVO, KubernetesPodVO } from '../../../../../../../../@core/data/kubernetes';
import { ApplicationVO } from '../../../../../../../../@core/data/application';
import { Subscription, timer, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, filter } from 'rxjs/operators';
import {
  WebSocketApiService,
  WsMessageActionEnum,
  WsMessageTopicEnum,
} from '../../../../../../../../@core/services/ws.api.service';
import { UuidUtil } from '../../../../../../../../@shared/utils/uuid.util';
import { WS_HEART_INTERVAL } from '../../../../../../../../@shared/constant/ws.constant';
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
import { UserScriptService } from '../../../../../../../../@core/services/user-script.service';
import { UserScriptVO } from '../../../../../../../../@core/data/user-script';

@Component({
  selector: 'app-kubernetes-pod-exec',
  templateUrl: './kubernetes-pod-exec.component.html',
  styleUrls: ['./kubernetes-pod-exec.component.less'],
})
export class KubernetesPodExecComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() data: any;

  // 组件销毁信号
  private destroy$ = new Subject<void>();

  // 组件属性
  uuid: string;
  instanceId: string;
  feedLines = 40;
  rows: number = 40;
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
  connectionStatus: string = 'Connecting';

  // Terminal相关
  terminal: Terminal;
  fitAddon = new FitAddon();
  webLinksAddon = new WebLinksAddon();
  baseTerminalOptions: ITerminalOptions = BASE_TERMINAL_OPTIONS;
  private terminalDisposables: { dispose(): void }[] = [];

  /** 本人脚本列表 + 内联选择面板 */
  userScripts: UserScriptVO[] = [];
  showScriptPicker = false;

  constructor(
    private wsApiService: WebSocketApiService,
    private uuidUtil: UuidUtil,
    private userScriptService: UserScriptService,
  ) {
    this.initializeTerminal();
  }

  private initializeTerminal(): void {
    this.terminal = new Terminal(this.baseTerminalOptions);
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(this.webLinksAddon);

    // Windows/Linux 习惯：有选区时 Ctrl+C 复制，无选区时透传 ^C（SIGINT）。
    // Mac 不拦截（保持 Ctrl+C=SIGINT、Cmd+C=复制的原生习惯）。
    const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
      || /Mac OS X/i.test(navigator.userAgent);
    this.terminal.attachCustomKeyEventHandler((event: KeyboardEvent): boolean => {
      if (event.type === 'keydown' && !isMac
        && event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        // Ctrl+C：有选区则复制并拦截；无选区透传 ^C（SIGINT）
        if (event.key === 'c' || event.code === 'KeyC') {
          if (this.terminal.hasSelection()) {
            this.copyToClipboard(this.terminal.getSelection());
            return false;
          }
          return true;
        }
        // Ctrl+V：拦截 ^V，放行浏览器原生粘贴（xterm 会捕获 paste 事件写入终端）
        if (event.key === 'v' || event.code === 'KeyV') {
          return false;
        }
      }
      return true;
    });
  }

  /** 复制文本到剪贴板：优先 Clipboard API（需 https/localhost），否则回退 execCommand（兼容 http）。 */
  private copyToClipboard(text: string): void {
    if (!text) {
      return;
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => this.fallbackCopy(text));
    } else {
      this.fallbackCopy(text);
    }
  }

  private fallbackCopy(text: string): void {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {
      // ignore
    }
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

  private setupTerminalResize(): void {
    // 监听窗口大小变化，防抖处理
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.handleTerminalResize();
      });
  }

  private setupTerminalFocus(): void {
    // 初始聚焦
    this.terminal.focus();

    // 监听点击事件，确保点击终端区域时聚焦
    const terminalElement = document.getElementById('kubernetesPodExec');
    if (terminalElement) {
      fromEvent(terminalElement, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.terminal.focus());
    }

    // 监听键盘事件，ESC 后重新聚焦
    fromEvent(document, 'keydown')
      .pipe(
        takeUntil(this.destroy$),
        filter((event: KeyboardEvent) => event.key === 'Escape')
      )
      .subscribe(() => {
        setTimeout(() => this.terminal.focus(), 0);
      });
  }

  private initializeWebSocket(): void {
    try {
      this.ws = this.wsApiService.createWsClient('/ssh/kubernetes');
      this.setupWebSocketEventHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.initializeWebSocket();
    this.startHeartbeat();
    this.loadUserScripts();
  }

  /** 加载当前登录用户的启用脚本(私有) */
  private loadUserScripts(): void {
    this.userScriptService.queryUserScriptPage({
      page: 1,
      length: 200,
      queryName: '',
      function: '',
      osType: '',
      valid: true,
    }).pipe(takeUntil(this.destroy$))
      .subscribe(({ body }) => {
        this.userScripts = body.data;
      });
  }

  /** 显示/隐藏 内联脚本选择面板 */
  openScriptPicker(): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }
    this.showScriptPicker = !this.showScriptPicker;
  }

  closeScriptPicker(): void {
    this.showScriptPicker = false;
  }

  /** 内联面板选中脚本后执行(不关闭面板) */
  onPickScript(content: string): void {
    this.execScriptContent(content);
  }

  /** 作为 shell 脚本执行: heredoc 写入 /tmp 文件后运行 */
  onPickScriptAsFile(content: string): void {
    if (!content || this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }
    const name = this.kubernetesPod?.metadata?.name ?? '';
    const ip = this.kubernetesPod?.status?.podIP ?? '';
    const rendered = content
      .replace(/\{\{\s*name\s*\}\}/g, name)
      .replace(/\{\{\s*ip\s*\}\}/g, ip);
    const file = `/tmp/cratos_script_${this.uuidUtil.uuid(8, 10)}.sh`;
    const payload = `cat > ${file} << 'CRATOS_EOF'\n${rendered}\nCRATOS_EOF\n` +
      `bash ${file}\n`;
    this.sendContainerInput(payload);
    this.terminal.focus();
  }

  /**
   * 渲染 {{name}}/{{ip}} 并逐行写入容器终端执行。
   * name = Pod 名(kubernetesPod.metadata.name), ip = Pod IP(kubernetesPod.status.podIP)。
   */
  private execScriptContent(content: string): void {
    if (!content || this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }
    const name = this.kubernetesPod?.metadata?.name ?? '';
    const ip = this.kubernetesPod?.status?.podIP ?? '';
    const rendered = content
      .replace(/\{\{\s*name\s*\}\}/g, name)
      .replace(/\{\{\s*ip\s*\}\}/g, ip);
    const lines = rendered.split('\n');
    lines.forEach(line => this.sendContainerInput(line + '\r'));
    this.terminal.focus();
  }

  /** 通过容器终端 INPUT 通道发送一段输入 */
  private sendContainerInput(input: string): void {
    const param: ApplicationKubernetesDetailsRequest = {
      topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_POD_EXEC,
      action: WsMessageActionEnum.INPUT,
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
      input: input,
    };
    deployment.pods.push(pod);
    param.deployments.push(deployment);
    this.sendWebSocketMessage(param);
  }

  ngAfterViewInit(): void {
    this.terminal.open(document.getElementById('kubernetesPodExec'));
    this.setupTerminalResize();
    this.setupTerminalFocus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanup();
  }

  private setupWebSocketEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      console.log('WebSocket connected');
      this.connectionStatus = 'Connected';
      this.lastHeartbeatTime = Date.now();
      this.initializeExecSession();
      this.setupTerminalInput();
    };

    this.ws.onmessage = (event) => {
      this.handleWebSocketMessage(event);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus = 'Disconnected';
      this.terminal.write(`\r\n\x1b[31mWebSocket error occurred [${new Date().toLocaleString()}] \x1b[0m\r\n`);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.connectionStatus = 'Disconnected';
      if (event.code !== 1000) {
        // 非正常关闭
        const reason = event.reason || 'Unknown reason';
        this.terminal.write(`\r\n\x1b[31mConnection closed unexpectedly [${new Date().toLocaleString()}] - Code: ${event.code}, Reason: ${reason} \x1b[0m\r\n`);
      } else {
        // 正常关闭
        this.terminal.write(`\r\n\x1b[32mConnection closed normally [${new Date().toLocaleString()}] \x1b[0m\r\n`);
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
            this.terminal.write(msg.output);
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

  private initializeExecSession(): void {
    this.fitAddon.fit();
    const defaultRows = this.rows;
    const defaultCols = this.terminal.cols;

    this.terminal.resize(defaultCols, Math.min(defaultRows, this.feedLines));

    // 设置终端行数自动增长
    this.terminalDisposables.push(this.terminal.onLineFeed(() => {
      if (this.feedLines < 1000) {
        this.feedLines++;
        this.terminal.resize(defaultCols, Math.min(defaultRows, this.feedLines));
      }
    }));

    const param: ApplicationKubernetesDetailsRequest = {
      topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_POD_EXEC,
      action: WsMessageActionEnum.EXEC,
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
      terminal: {
        cols: defaultCols,
        rows: defaultRows,
      },
    };

    deployment.pods.push(pod);
    param.deployments.push(deployment);

    this.sendWebSocketMessage(param);
  }

  private setupTerminalInput(): void {
    this.terminalDisposables.push(this.terminal.onData((event) => {
      const param: ApplicationKubernetesDetailsRequest = {
        topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_POD_EXEC,
        action: WsMessageActionEnum.INPUT,
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
        input: event,
      };

      deployment.pods.push(pod);
      param.deployments.push(deployment);

      this.sendWebSocketMessage(param);
    }));
  }

  private handleTerminalResize(): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return;

    this.fitAddon.fit();
    const defaultRows = this.rows;
    const defaultCols = this.terminal.cols;

    this.terminal.resize(defaultCols, Math.min(defaultRows, this.feedLines));

    const param: ApplicationKubernetesDetailsRequest = {
      topic: WsMessageTopicEnum.APPLICATION_KUBERNETES_POD_EXEC,
      action: WsMessageActionEnum.RESIZE,
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
      terminal: {
        cols: defaultCols,
        rows: defaultRows,
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

    // 清理Terminal disposables
    this.terminalDisposables.forEach(d => {
      try { d.dispose(); } catch (e) {}
    });
    this.terminalDisposables = [];

    // 清理Terminal
    if (this.terminal) {
      try {
        this.terminal.dispose();
      } catch (error) {
        console.error('Error disposing terminal:', error);
      }
    }
  }

  // 公共方法
  onResize(event: any): void {
    this.handleTerminalResize();
  }

  onReconnect(): void {
    this.connectionStatus = 'Connecting';
    this.terminal.write('\r\n\x1b[33mReconnecting...\x1b[0m\r\n');
    // 清理旧连接
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }
    this.initializeWebSocket();
  }

  onRowExit(): void {
    this.cleanup();
    if (this.closeHandler) {
      this.closeHandler();
    }
  }

  protected readonly getRowColor = getRowColor;
}
