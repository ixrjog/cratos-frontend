import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { ServerAccountService } from '../../../../../../@core/services/server-account.service';
import { ServerAccountPageQuery, ServerAccountVO } from '../../../../../../@core/data/server-account';

@Component({
  selector: 'app-eds-asset-ssh-terminal',
  templateUrl: './eds-asset-ssh-terminal.component.html',
  styleUrls: [ './eds-asset-ssh-terminal.component.less' ],
})
export class EdsAssetSshTerminalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() data: any;

  private destroy$ = new Subject<void>();

  uuid: string;
  instanceId: string;
  feedLines = 40;
  rows: number = 40;
  formData: EdsAssetVO;
  closeHandler: Function;

  serverAccounts: ServerAccountVO[] = [];
  selectedServerAccount: string | ServerAccountVO = '';
  isConnected = false;
  hasError = false;

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
    this.initServerAccount();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.terminal.open(document.getElementById('edsAssetSshTerminal'));
      this.fitAddon.fit();
      fromEvent(window, 'resize')
        .pipe(debounceTime(300), takeUntil(this.destroy$))
        .subscribe(() => this.handleTerminalResize());
    }, 100);
  }

  ngOnDestroy(): void {
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
      .subscribe(({ body }) => {
        this.serverAccounts = body.data;
      });
  }

  onServerAccountChange(account: ServerAccountVO): void {
    this.selectedServerAccount = account;
    if (this.isConnected) {
      this.cleanupConnection();
      this.isConnected = false;
    }
    if (this.selectedServerAccount) {
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
    this.fitAddon.fit();
    this.terminal.resize(this.terminal.cols, Math.min(this.rows, this.feedLines));

    this.terminal.onLineFeed(() => {
      this.feedLines++;
      this.terminal.resize(this.terminal.cols, Math.min(this.rows, this.feedLines));
    });

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

  private setupTerminalInput(): void {
    this.terminal.onData((event) => {
      if (this.hasError) return;
      
      this.sendMessage({
        state: WebTerminalStatus.COMMAND,
        instanceId: this.instanceId,
        input: event,
        terminal: { cols: this.terminal.cols, rows: this.rows },
      });
    });
  }

  private handleTerminalResize(): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return;

    this.fitAddon.fit();
    this.terminal.resize(this.terminal.cols, Math.min(this.rows, this.feedLines));

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
    this.terminal?.dispose();
  }

  onResize(): void {
    this.handleTerminalResize();
  }

  onRowExit(): void {
    this.cleanup();
    if (this.closeHandler && typeof this.closeHandler === 'function') {
      this.closeHandler();
    }
  }
}
