import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  WebTerminalCloseRequest,
  WebTerminalCommandRequest,
  WebTerminalOpenRequest,
  WebTerminalResizeRequest,
  WebTerminalStatus,
} from '../../../../@core/data/web-terminal';
import { SessionOutput } from '../../../../@core/data/ssh-terminal';
import { EdsAssetVO } from '../../../../@core/data/ext-datasource';
import { DrawerService } from 'ng-devui/drawer';
import { WebTerminalDrawerComponent } from './web-terminal-drawer/web-terminal-drawer.component';
import { WebSocketApiService } from '../../../../@core/services/ws.api.service';
import { UuidUtil } from '../../../../@shared/utils/uuid.util';
import { WS_HEART_INTERVAL } from '../../../../@shared/constant/ws.constant';

export interface TerminalInstance {
  instanceId: string;
  assetId: number;
  assetName: string;
  asset: EdsAssetVO;
  isSelected: boolean;
  isConnected: boolean;
  lastActivity: Date;
}

@Component({
  selector: 'app-web-terminal-management',
  templateUrl: './web-terminal-management.component.html',
  styleUrls: ['./web-terminal-management.component.less']
})
export class WebTerminalManagementComponent implements OnInit, OnDestroy {

  // 组件销毁信号
  private destroy$ = new Subject<void>();

  // WebSocket相关
  private ws: WebSocket | null = null;
  private heartbeatSubscription: Subscription | null = null;
  private lastHeartbeatTime: number = 0;
  private readonly HEARTBEAT_TIMEOUT = 30000; // 30秒超时检测

  terminals: TerminalInstance[] = [];
  selectedTerminals: string[] = [];

  constructor(
    private drawerService: DrawerService,
    private wsApiService: WebSocketApiService,
    private uuidUtil: UuidUtil,
  ) {
  }

  ngOnInit(): void {
    this.initializeWebSocket();
    this.startHeartbeat();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanup();
  }

  private initializeWebSocket(): void {
    try {
      this.ws = this.wsApiService.createWsClient('/ssh/crystal');
      this.setupWebSocketEventHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }

  private setupWebSocketEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      console.log('WebSocket connected');
      this.lastHeartbeatTime = Date.now();
    };

    this.ws.onmessage = (event) => {
      this.handleWebSocketMessage(event);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      if (event.code !== 1000) {
        // 非正常关闭，尝试重连
        console.log('Attempting to reconnect in 3 seconds...');
        setTimeout(() => {
          if (!this.destroy$.closed) {
            this.initializeWebSocket();
          }
        }, 3000);
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
      msgList.forEach(sessionOutput => {
        const terminal = this.terminals.find(t => t.instanceId === sessionOutput.instanceId);
        if (terminal) {
          // 更新终端状态
          terminal.isConnected = sessionOutput.statusCd === 'CONNECTED';
          terminal.lastActivity = new Date();

          // 准备事件详情对象
          const eventDetail: any = { instanceId: sessionOutput.instanceId };

          // 如果有正常输出，添加到事件详情中
          if (sessionOutput.output) {
            eventDetail.output = sessionOutput.output;
          }

          // 如果有错误消息，添加到事件详情中
          if (sessionOutput.errorMsg) {
            eventDetail.errorMsg = sessionOutput.errorMsg;
          }

          // 如果有输出或错误消息，通过事件通知对应的终端组件
          if (sessionOutput.output || sessionOutput.errorMsg) {
            const event = new CustomEvent('terminalOutput', {
              detail: eventDetail,
            });
            window.dispatchEvent(event);
          }
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
        filter(() => this.ws?.readyState === WebSocket.OPEN),
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

  private generateInstanceId(assetName: string): string {
    const randomStr = Math.random().toString(36).substring(2, 10);
    return `${assetName}#${randomStr}`;
  }

  onOpenAssetDrawer(): void {
    let drawerRef: any;

    // 先设置静态数据
    WebTerminalDrawerComponent.drawerData = {
      onAssetSelect: (asset: EdsAssetVO) => {
        this.onAssetSelect(asset);
      },
      close: () => {
        if (drawerRef) {
          drawerRef.drawerInstance.hide();
        }
      },
    };

    drawerRef = this.drawerService.open({
      drawerContentComponent: WebTerminalDrawerComponent,
      width: '1400px',
      zIndex: 1000,
      isCover: true,
      fullScreen: false,
      backdropCloseable: true,
      escKeyCloseable: true,
      position: 'right',
      onClose: () => {
        console.log('Drawer closed');
        // 清理静态数据
        WebTerminalDrawerComponent.drawerData = {};
      },
    });
  }

  onAssetSelect(asset: EdsAssetVO): void {
    const instanceId = this.generateInstanceId(asset.name);

    const terminal: TerminalInstance = {
      instanceId,
      assetId: asset.id,
      assetName: asset.name,
      asset,
      isSelected: false,
      isConnected: false,
      lastActivity: new Date(),
    };

    this.terminals.push(terminal);

    // 发送OPEN事件到后端
    this.sendTerminalOpenRequest(terminal);
  }

  private sendTerminalOpenRequest(terminal: TerminalInstance): void {
    const request: WebTerminalOpenRequest = {
      state: WebTerminalStatus.OPEN,
      terminal: {
        width: 60,
        height: 20,
      },
      assetId: terminal.assetId,
      instanceId: terminal.instanceId,
    };

    this.sendWebSocketMessage(request);
    console.log(`Sent ${WebTerminalStatus.OPEN} event for terminal: ${terminal.instanceId}`);
  }

  onTerminalSelect(data: { instanceId: string, selected: boolean }): void {
    const terminal = this.terminals.find(t => t.instanceId === data.instanceId);
    if (terminal) {
      terminal.isSelected = data.selected;

      if (data.selected) {
        if (!this.selectedTerminals.includes(data.instanceId)) {
          this.selectedTerminals.push(data.instanceId);
        }
      } else {
        this.selectedTerminals = this.selectedTerminals.filter(id => id !== data.instanceId);
      }
    }
  }

  onTerminalClose(instanceId: string): void {
    const terminal = this.terminals.find(t => t.instanceId === instanceId);
    if (terminal) {
      // 发送CLOSE事件到后端
      this.sendTerminalCloseRequest(terminal);

      // 从列表中移除
      this.terminals = this.terminals.filter(t => t.instanceId !== instanceId);
      this.selectedTerminals = this.selectedTerminals.filter(id => id !== instanceId);

      console.log(`Sent ${WebTerminalStatus.CLOSE} event for terminal: ${instanceId}`);
    }
  }

  private sendTerminalCloseRequest(terminal: TerminalInstance): void {
    const request: WebTerminalCloseRequest = {
      state: WebTerminalStatus.CLOSE,
      terminal: {
        width: 60,
        height: 20,
      },
      instanceId: terminal.instanceId,
    };

    this.sendWebSocketMessage(request);
  }

  onTerminalResize(data: { instanceId: string, width: number, height: number }): void {
    const terminal = this.terminals.find(t => t.instanceId === data.instanceId);
    if (terminal) {
      // 发送RESIZE事件到后端
      this.sendTerminalResizeRequest(terminal, data.width, data.height);
      console.log(`Sent ${WebTerminalStatus.RESIZE} event for terminal: ${data.instanceId} (${data.width}x${data.height})`);
    }
  }

  private sendTerminalResizeRequest(terminal: TerminalInstance, width: number, height: number): void {
    const request: WebTerminalResizeRequest = {
      state: WebTerminalStatus.RESIZE,
      terminal: {
        width: width,
        height: height,
      },
      instanceId: terminal.instanceId,
    };

    this.sendWebSocketMessage(request);
  }

  onTerminalCommand(data: { instanceId: string, command: string }): void {
    // 如果有多个终端被选中，向所有选中的终端发送命令
    if (this.selectedTerminals.length > 1) {
      this.selectedTerminals.forEach(instanceId => {
        this.sendTerminalCommandRequest(instanceId, data.command);
      });
      console.log(`Sent ${WebTerminalStatus.COMMAND} event to ${this.selectedTerminals.length} selected terminals`);
    } else {
      // 单个终端命令
      this.sendTerminalCommandRequest(data.instanceId, data.command);
      console.log(`Sent ${WebTerminalStatus.COMMAND} event to terminal: ${data.instanceId}`);
    }
  }

  private sendTerminalCommandRequest(instanceId: string, command: string): void {
    const terminal = this.terminals.find(t => t.instanceId === instanceId);
    if (terminal) {
      const request: WebTerminalCommandRequest = {
        state: WebTerminalStatus.COMMAND,
        terminal: {
          width: 60,
          height: 20,
        },
        instanceId: terminal.instanceId,
        input: command,
      };

      this.sendWebSocketMessage(request);
    }
  }

  onSelectAll(): void {
    this.terminals.forEach(terminal => {
      terminal.isSelected = true;
    });
    this.selectedTerminals = this.terminals.map(t => t.instanceId);
  }

  onClearSelection(): void {
    this.terminals.forEach(terminal => {
      terminal.isSelected = false;
    });
    this.selectedTerminals = [];
  }

  onCloseSelectedTerminals(): void {
    if (this.selectedTerminals.length === 0) {
      return;
    }

    // 获取选中终端的详细信息
    const selectedTerminals = this.terminals.filter(t =>
      this.selectedTerminals.includes(t.instanceId),
    );

    const selectedCount = selectedTerminals.length;
    const terminalNames = selectedTerminals.map(t => t.assetName).join(', ');

    // 构建确认消息
    let confirmMessage: string;
    if (selectedCount === 1) {
      confirmMessage = `确定要关闭终端 "${terminalNames}" 吗？`;
    } else if (selectedCount <= 3) {
      confirmMessage = `确定要关闭以下 ${selectedCount} 个终端吗？\n${terminalNames}`;
    } else {
      const firstThree = selectedTerminals.slice(0, 3).map(t => t.assetName).join(', ');
      confirmMessage = `确定要关闭 ${selectedCount} 个终端吗？\n包括：${firstThree} 等...`;
    }

    if (confirm(confirmMessage)) {
      // 批量关闭选中的终端
      const terminalsToClose = [ ...this.selectedTerminals ]; // 创建副本避免迭代时修改数组

      terminalsToClose.forEach(instanceId => {
        this.onTerminalClose(instanceId);
      });

      console.log(`Successfully closed ${terminalsToClose.length} selected terminals`);

      // 可以添加成功提示
      // this.toastService.success(`已成功关闭 ${terminalsToClose.length} 个终端`);
    }
  }

  isTerminalSelected(instanceId: string): boolean {
    return this.selectedTerminals.includes(instanceId);
  }

  trackByTerminalId(index: number, terminal: TerminalInstance): string {
    return terminal.instanceId;
  }
}
