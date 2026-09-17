import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EdsAssetVO } from '../../../../../../@core/data/ext-datasource';
import { fromEvent, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { WebSocketApiService } from '../../../../../../@core/services/ws.api.service';
import { UuidUtil } from '../../../../../../@shared/utils/uuid.util';
import { WS_HEART_INTERVAL } from '../../../../../../@shared/constant/ws.constant';
import { WebTerminalStatus, WebTerminalSuperOpenRequest } from '../../../../../../@core/data/web-terminal';
import { SessionOutput } from '../../../../../../@core/data/ssh-terminal';
import { ITerminalOptions, Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { BASE_TERMINAL_OPTIONS } from '../../../../../../@shared/constant/xterm.constant';
import { onTerminalDataWithImeFix } from '../../../../../../@shared/utils/xterm-ime.util';
import { ServerAccountService } from '../../../../../../@core/services/server-account.service';
import { ServerAccountPageQuery, ServerAccountVO } from '../../../../../../@core/data/server-account';
import { UserScriptService } from '../../../../../../@core/services/user-script.service';
import { UserScriptVO } from '../../../../../../@core/data/user-script';

@Component({
  selector: 'app-eds-asset-ssh-terminal',
  templateUrl: './eds-asset-ssh-terminal.component.html',
  styleUrls: [ './eds-asset-ssh-terminal.component.less' ],
})
export class EdsAssetSshTerminalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() data: any;

  @ViewChild('termEl', { static: false }) private termRef: ElementRef;
  private resizeObserver: any = null;
  private resizeDebounce: any = null;

  /** 弹窗内 section 高度(默认 100%, 打开时可传入固定像素让终端撑满 80% 弹窗) */
  sectionHeight = '100%';

  private destroy$ = new Subject<void>();

  uuid: string;
  instanceId: string;
  feedLines = 40;
  rows: number = 24;

  private calculateRows(): number {
    // 容器不可见(多 tab 切换时 display:none)尺寸为 0, 此时 fit() 会算出错误的 cols/rows, 保持现值
    if (!this.isTerminalVisible()) {
      return this.rows;
    }
    // 使用fitAddon来获取准确的终端尺寸
    this.fitAddon.fit();
    return this.terminal.rows;
  }

  /**
   * 终端容器是否可见且有实际尺寸。
   * offsetParent 为 null 表示自身或祖先 display:none(多 tab 切换时的隐藏 tab)。
   */
  private isTerminalVisible(): boolean {
    const el: HTMLElement | null = this.termRef?.nativeElement || document.getElementById('edsAssetSshTerminal');
    if (!el) {
      return false;
    }
    return el.offsetParent !== null && el.clientWidth > 0 && el.clientHeight > 0;
  }
  formData: EdsAssetVO;
  closeHandler: Function;

  serverAccounts: ServerAccountVO[] = [];
  selectedServerAccount: string | ServerAccountVO = '';
  isConnected = false;
  hasError = false;
  showAssetDetails = true;

  /** 本人脚本列表(终端内快速执行) */
  userScripts: UserScriptVO[] = [];

  private ws: WebSocket | null = null;
  private heartbeatSubscription: Subscription | null = null;

  terminal: Terminal;
  fitAddon = new FitAddon();
  webLinksAddon = new WebLinksAddon();
  baseTerminalOptions: ITerminalOptions = BASE_TERMINAL_OPTIONS;

  constructor(
    private wsApiService: WebSocketApiService,
    private uuidUtil: UuidUtil,
    private serverAccountService: ServerAccountService,
    private userScriptService: UserScriptService,
  ) {
    this.initializeTerminal();
  }

  private initializeTerminal(): void {
    this.terminal = new Terminal(this.baseTerminalOptions);
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(this.webLinksAddon);
  }

  ngOnInit(): void {
    this.closeHandler = this.data['hideDialog'];
    this.formData = this.data['formData'];
    // 弹窗高度(打开时按页面高度 80% 计算的固定像素), 用于让终端区域撑满弹窗
    if (this.formData && (this.formData as any).__dialogHeight) {
      this.sectionHeight = (this.formData as any).__dialogHeight;
    }
    this.initServerAccount();
    this.loadUserScripts();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.terminal.open(this.termRef?.nativeElement || document.getElementById('edsAssetSshTerminal'));
      this.rows = this.calculateRows();

      fromEvent(window, 'resize')
        .pipe(debounceTime(300), takeUntil(this.destroy$))
        .subscribe(() => this.handleTerminalResize());

      // 监听终端容器尺寸变化(内联面板/tab 切换/窗口缩放都能覆盖), 动态 refit
      const el = this.termRef?.nativeElement;
      if (el && (window as any).ResizeObserver) {
        this.resizeObserver = new (window as any).ResizeObserver(() => {
          if (this.resizeDebounce) {
            clearTimeout(this.resizeDebounce);
          }
          this.resizeDebounce = setTimeout(() => this.handleTerminalResize(), 150);
        });
        this.resizeObserver.observe(el);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.resizeDebounce) {
      clearTimeout(this.resizeDebounce);
      this.resizeDebounce = null;
    }
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanup();
  }

  private initServerAccount(): void {
    // 从businessTags中查找serverAccount
    const serverAccountTag = this.formData.businessTags?.find(tag => tag.tag.tagKey === 'ServerAccount');

    if (serverAccountTag?.tagValue) {
      this.selectedServerAccount = serverAccountTag.tagValue;
      setTimeout(() => {
        this.connectTerminal();
        this.terminal.focus();
      }, 100);
    }
    this.loadServerAccounts();

  }

  private loadServerAccounts(): void {
    const query: ServerAccountPageQuery = {
      page: 1,
      length: 20,
      queryName: '',
      valid: true,
      protocol: 'SSH',
    };

    this.serverAccountService.queryServerAccountPage(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ body }) => {
        this.serverAccounts = body.data;
      });
  }

  onServerAccountChange(account: ServerAccountVO): void {
    this.selectedServerAccount = account;

    // 清理现有连接
    if (this.isConnected) {
      this.cleanupConnection();
      this.isConnected = false;
    }

    if (this.selectedServerAccount) {
      // 重新生成instanceId
      this.initializeInstanceId();

      setTimeout(() => {
        this.terminal.clear();
        this.connectTerminal();
        this.terminal.focus();
      }, 200);
    }
  }

  private connectTerminal(): void {
    if (!this.selectedServerAccount) return;
    this.hasError = false;
    this.initializeInstanceId();
    this.initializeWebSocket();
    this.startHeartbeat();
    this.isConnected = true;
  }

  private initializeInstanceId() {
    this.uuid = this.uuidUtil.uuid(8, 10);
    this.instanceId = this.formData.name + '#' + this.uuid;
  }

  private initializeWebSocket(): void {
    this.ws = this.wsApiService.createWsClient('/ssh/crystal');

    this.ws.onopen = () => {
      this.initializeSSHSession();
      this.setupTerminalInput();
      setTimeout(() => this.terminal.focus(), 200);
    };

    this.ws.onmessage = (event) => {
      if (!event.data) return;

      try {
        const msgList: SessionOutput[] = JSON.parse(event.data);
        msgList
          .filter(msg => msg.instanceId === this.instanceId)
          .forEach(msg => {
            if (msg.errorMsg) {
              this.terminal.write(`\r\n\x1b[31mError: ${msg.errorMsg}\x1b[0m\r\n`);
              this.hasError = true;
            } else if (msg.output) {
              this.terminal.write(msg.output);
            }
            this.terminal.scrollToBottom();
          });
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = () => {
      this.terminal.write(`\r\n\x1b[31mWebSocket error occurred\x1b[0m\r\n`);
      this.isConnected = false;
    };

    this.ws.onclose = (event) => {
      const message = event.code !== 1000
        ? `\r\n\x1b[31mConnection closed unexpectedly\x1b[0m\r\n`
        : `\r\n\x1b[32mConnection closed normally\x1b[0m\r\n`;
      this.terminal.write(message);
      this.isConnected = false;
    };
  }

  private startHeartbeat(): void {
    this.heartbeatSubscription = timer(5000, WS_HEART_INTERVAL)
      .pipe(takeUntil(this.destroy$), filter(() => this.ws?.readyState === WebSocket.OPEN))
      .subscribe(() => this.wsApiService.onPing(this.ws));
  }

  private initializeSSHSession(): void {
    this.terminal.resize(this.terminal.cols, this.rows);

    const serverAccountName = typeof this.selectedServerAccount === 'string'
      ? this.selectedServerAccount
      : this.selectedServerAccount?.name || 'root';

    const param: WebTerminalSuperOpenRequest = {
      state: WebTerminalStatus.SUPER_OPEN,
      assetId: this.formData.id,
      instanceId: this.instanceId,
      serverAccount: serverAccountName,
      terminal: {
        cols: this.terminal.cols,
        rows: this.rows,
      },
    };

    this.sendMessage(param);
  }

  private terminalInputDisposable: any = null;

  private setupTerminalInput(): void {
    // 清理之前的输入监听器
    if (this.terminalInputDisposable) {
      this.terminalInputDisposable.dispose();
    }

    this.terminalInputDisposable = onTerminalDataWithImeFix(this.terminal, (event) => {
      if (this.hasError) return;

      this.sendMessage({
        state: WebTerminalStatus.COMMAND,
        instanceId: this.instanceId,
        input: event,
        terminal: { cols: this.terminal.cols, rows: this.rows },
      });
    });
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

  /** 显示/隐藏 内联脚本选择面板(不使用全屏遮罩弹窗, 避免背景变色) */
  showScriptPicker = false;

  openScriptPicker(): void {
    if (this.hasError || this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }
    this.showScriptPicker = !this.showScriptPicker;
  }

  /** 内联面板选中脚本后执行(内容为在线编辑后的文本, 不关闭面板) */
  onPickScript(content: string): void {
    this.execScriptContent(content);
  }

  /** 作为 shell 脚本执行: heredoc 写入 /tmp 文件后运行 */
  onPickScriptAsFile(content: string): void {
    this.execScriptAsFile(content);
  }

  /** 渲染 {{name}}/{{ip}} 并逐行写入终端执行 */
  private execScriptContent(content: string): void {
    if (!content) {
      return;
    }
    if (this.hasError || this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }
    const name = this.formData?.name ?? '';
    const ip = this.formData?.assetKey ?? '';
    const rendered = content
      .replace(/\{\{\s*name\s*\}\}/g, name)
      .replace(/\{\{\s*ip\s*\}\}/g, ip);
    const lines = rendered.split('\n');
    lines.forEach(line => {
      this.sendMessage({
        state: WebTerminalStatus.COMMAND,
        instanceId: this.instanceId,
        input: line + '\r',
        terminal: { cols: this.terminal.cols, rows: this.rows },
      });
    });
    this.terminal.focus();
  }

  /**
   * 作为 shell 脚本执行: 用 heredoc 将脚本写入 /tmp 唯一文件, 再 bash 执行。
   * 适合多行/含控制流的脚本(逐行敲入无法正确处理 if/for/函数等)。
   */
  private execScriptAsFile(content: string): void {
    if (!content) {
      return;
    }
    if (this.hasError || this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }
    const name = this.formData?.name ?? '';
    const ip = this.formData?.assetKey ?? '';
    const rendered = content
      .replace(/\{\{\s*name\s*\}\}/g, name)
      .replace(/\{\{\s*ip\s*\}\}/g, ip);
    const file = `/tmp/cratos_script_${this.uuidUtil.uuid(8, 10)}.sh`;
    // heredoc 用单引号 EOF, 内容原样写入(脚本内的 $VAR 交给 bash 执行时展开)
    const payload = `cat > ${file} << 'CRATOS_EOF'\n${rendered}\nCRATOS_EOF\n` +
      `bash ${file}\n`;
    this.sendMessage({
      state: WebTerminalStatus.COMMAND,
      instanceId: this.instanceId,
      input: payload,
      terminal: { cols: this.terminal.cols, rows: this.rows },
    });
    this.terminal.focus();
  }

  closeScriptPicker(): void {
    this.showScriptPicker = false;
  }

  private handleTerminalResize(): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    // 隐藏期间(多 tab 切换)容器尺寸为 0, 若此时 fit 并上报, 服务端 PTY 会被改成错误列宽,
    // 远端 shell 按该列宽重新折行, 切回该 tab 后就看到断行错乱的内容
    if (!this.isTerminalVisible()) return;

    this.rows = this.calculateRows();

    this.sendMessage({
      state: WebTerminalStatus.RESIZE,
      instanceId: this.instanceId,
      terminal: { cols: this.terminal.cols, rows: this.rows },
    });
  }

  private sendMessage(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private cleanupConnection(): void {
    this.heartbeatSubscription?.unsubscribe();

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.sendMessage({
          state: WebTerminalStatus.CLOSE,
          instanceId: this.instanceId,
          terminal: { cols: this.terminal.cols, rows: this.rows },
        });
        this.ws.close(1000, 'Switching account');
      }
      this.ws = null;
    }
  }

  private cleanup(): void {
    this.cleanupConnection();

    // 清理输入监听器
    if (this.terminalInputDisposable) {
      this.terminalInputDisposable.dispose();
      this.terminalInputDisposable = null;
    }

    this.terminal?.dispose();
  }

  onResize(): void {
    this.handleTerminalResize();
  }



  getStatusClass(status: string): string {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('running') || statusLower.includes('active')) {
      return 'running';
    }
    if (statusLower.includes('stopped') || statusLower.includes('inactive')) {
      return 'stopped';
    }
    if (statusLower.includes('pending') || statusLower.includes('starting')) {
      return 'pending';
    }
    return '';
  }
}
