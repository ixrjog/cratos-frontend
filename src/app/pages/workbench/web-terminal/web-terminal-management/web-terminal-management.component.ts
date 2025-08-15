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
import { TranslateService } from '@ngx-translate/core';

export interface TerminalInstance {
  instanceId: string;
  assetId: number;
  assetName: string;
  asset: EdsAssetVO;
  isSelected: boolean;
  isConnected: boolean;
  lastActivity: Date;
  rows?: number;
  cols?: number;
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
  private isWebSocketInitialized: boolean = false; // 标记WebSocket是否已初始化
  private pendingMessages: any[] = []; // 待发送的消息队列
  
  // WebSocket连接状态显示
  wsConnectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';
  wsConnectionTime: Date | null = null;

  terminals: TerminalInstance[] = [];
  selectedTerminals: string[] = [];
  
  // 宽屏模式终端集合
  wideScreenTerminals: Set<string> = new Set();

  constructor(
    private drawerService: DrawerService,
    private wsApiService: WebSocketApiService,
    private uuidUtil: UuidUtil,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    // 页面初始化时不再初始化WebSocket，等到第一次打开终端时再初始化
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanup();
  }

  private initializeWebSocket(): void {
    // 如果已经初始化过，直接返回
    if (this.isWebSocketInitialized && this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.wsConnectionStatus = 'connecting';
      this.ws = this.wsApiService.createWsClient('/ssh/crystal');
      this.setupWebSocketEventHandlers();
      this.startHeartbeat();
      this.isWebSocketInitialized = true;
      console.log('WebSocket client initialized');
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.isWebSocketInitialized = false;
      this.wsConnectionStatus = 'error';
    }
  }

  private setupWebSocketEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      console.log('WebSocket connected');
      this.wsConnectionStatus = 'connected';
      this.wsConnectionTime = new Date();
      this.lastHeartbeatTime = Date.now();
      
      // 发送待发送的消息
      this.processPendingMessages();
    };

    this.ws.onmessage = (event) => {
      this.handleWebSocketMessage(event);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.wsConnectionStatus = 'error';
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      // 重置初始化状态，不进行重连
      this.isWebSocketInitialized = false;
      this.wsConnectionStatus = 'disconnected';
      this.wsConnectionTime = null;
      // 清空待发送消息队列
      this.pendingMessages = [];
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
        console.log('WebSocket message sent:', message);
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
      }
    } else {
      // WebSocket未连接，将消息加入待发送队列
      console.log('WebSocket not ready, adding message to pending queue:', message);
      this.pendingMessages.push(message);
    }
  }

  private processPendingMessages(): void {
    if (this.pendingMessages.length > 0) {
      console.log(`Processing ${this.pendingMessages.length} pending messages`);
      const messages = [...this.pendingMessages];
      this.pendingMessages = [];
      
      messages.forEach(message => {
        try {
          this.ws?.send(JSON.stringify(message));
          console.log('Pending message sent:', message);
        } catch (error) {
          console.error('Failed to send pending message:', error);
        }
      });
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

    // 重置初始化状态和连接状态
    this.isWebSocketInitialized = false;
    this.wsConnectionStatus = 'disconnected';
    this.wsConnectionTime = null;
    // 清空待发送消息队列
    this.pendingMessages = [];
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
    // 如果是第一次打开终端，需要初始化WebSocket客户端
    if (!this.isWebSocketInitialized) {
      console.log('First terminal opening, initializing WebSocket client...');
      this.initializeWebSocket();
    }

    const instanceId = this.generateInstanceId(asset.name);

    const terminal: TerminalInstance = {
      instanceId,
      assetId: asset.id,
      assetName: asset.name,
      asset,
      isSelected: false,
      isConnected: false,
      lastActivity: new Date(),
      rows: 24,  // 默认行数
      cols: 80,  // 默认列数
    };

    this.terminals.push(terminal);

    // 发送OPEN事件到后端
    this.sendTerminalOpenRequest(terminal);
    
    // 延迟更新布局，确保DOM已渲染
    setTimeout(() => {
      this.updateGridLayout();
    }, 200);
  }

  private sendTerminalOpenRequest(terminal: TerminalInstance): void {
    const request: WebTerminalOpenRequest = {
      state: WebTerminalStatus.OPEN,
      terminal: {
        rows: terminal.rows || 24,
        cols: terminal.cols || 80,
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
      
      // 从宽屏集合中移除
      this.wideScreenTerminals.delete(instanceId);
      
      // 更新布局
      setTimeout(() => {
        this.updateGridLayout();
      }, 50);
    }
  }

  private sendTerminalCloseRequest(terminal: TerminalInstance): void {
    const request: WebTerminalCloseRequest = {
      state: WebTerminalStatus.CLOSE,
      terminal: {
        rows: terminal.rows || 24,
        cols: terminal.cols || 80,
      },
      instanceId: terminal.instanceId,
    };

    this.sendWebSocketMessage(request);
  }

  onTerminalResize(data: { instanceId: string, width: number, height: number }): void {
    const terminal = this.terminals.find(t => t.instanceId === data.instanceId);
    if (terminal) {
      // 更新终端实例中的尺寸信息
      terminal.cols = data.width;
      terminal.rows = data.height;
      
      // 发送RESIZE事件到后端
      this.sendTerminalResizeRequest(terminal, data.width, data.height);
    }
  }

  // 处理终端初始化完成后的尺寸设置
  onTerminalReady(data: { instanceId: string, width: number, height: number }): void {
    const terminal = this.terminals.find(t => t.instanceId === data.instanceId);
    if (terminal) {
      // 更新终端实例中的尺寸信息
      terminal.cols = data.width;
      terminal.rows = data.height;
      
      console.log(`Terminal ${data.instanceId} initialized with dimensions: ${data.width}x${data.height}`);
      
      // 如果需要，可以重新发送OPEN请求以确保后端获得正确的尺寸
      // this.sendTerminalOpenRequest(terminal);
    }
  }

  private sendTerminalResizeRequest(terminal: TerminalInstance, width: number, height: number): void {
    const request: WebTerminalResizeRequest = {
      state: WebTerminalStatus.RESIZE,
      terminal: {
        cols: width,
        rows: height,
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
          rows: terminal.rows || 24,
          cols: terminal.cols || 80,
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

  // 处理终端宽屏模式切换
  onTerminalWideScreenToggle(data: { instanceId: string, isWideScreen: boolean }): void {
    if (data.isWideScreen) {
      this.wideScreenTerminals.add(data.instanceId);
    } else {
      this.wideScreenTerminals.delete(data.instanceId);
    }
    
    // 延迟重新计算布局
    setTimeout(() => {
      this.updateGridLayout();
    }, 50);
  }

  // 动态更新网格布局
  private updateGridLayout(): void {
    const gridElement = document.querySelector('.terminal-grid') as HTMLElement;
    if (!gridElement) return;

    // 重置网格容器的样式
    gridElement.style.gridAutoRows = '';
    
    // 重置所有终端的网格位置和样式
    const terminalElements = gridElement.querySelectorAll('.web-terminal-item');
    terminalElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.gridColumn = '';
      htmlElement.style.gridRow = '';
      htmlElement.style.minHeight = '';
      htmlElement.style.maxHeight = '';
      htmlElement.style.height = '';
    });

    // 强制重新计算布局
    setTimeout(() => {
      this.calculateGridPositions();
    }, 10);
  }

  // 分离布局计算逻辑
  private calculateGridPositions(): void {
    let currentRow = 1;
    let currentCol = 1;

    this.terminals.forEach((terminal, index) => {
      const element = document.querySelector(`[data-terminal-id="${terminal.instanceId}"]`) as HTMLElement;
      if (!element) return;

      if (this.wideScreenTerminals.has(terminal.instanceId)) {
        // 如果当前行已经有终端，需要换到下一行
        if (currentCol > 1) {
          currentRow++;
          currentCol = 1;
        }
        
        // 宽屏终端：占据整行
        element.style.gridColumn = '1 / -1';
        element.style.gridRow = `${currentRow}`;
        currentRow++; // 宽屏终端占用一行后，下一个终端从新行开始
        currentCol = 1;
      } else {
        // 普通终端：按两列布局
        element.style.gridColumn = `${currentCol}`;
        element.style.gridRow = `${currentRow}`;
        
        if (currentCol === 2) {
          currentRow++;
          currentCol = 1;
        } else {
          currentCol++;
        }
      }
    });
  }

  // 矫正所有终端窗体
  onCorrectAllTerminals(): void {
    if (this.terminals.length === 0) {
      return;
    }

    console.log('Starting terminal correction for all terminals...');
    
    let correctedCount = 0;
    const totalTerminals = this.terminals.length;

    this.terminals.forEach((terminal, index) => {
      // 延迟发送，避免同时发送太多请求
      setTimeout(() => {
        if (terminal.rows && terminal.cols) {
          // 发送当前尺寸的resize请求来矫正终端
          this.sendTerminalResizeRequest(terminal, terminal.cols, terminal.rows);
          correctedCount++;
          
          console.log(`Corrected terminal ${terminal.instanceId} (${terminal.cols}x${terminal.rows}) - ${correctedCount}/${totalTerminals}`);
          
          // 如果是最后一个终端，显示完成消息
          if (correctedCount === totalTerminals) {
            console.log(`Terminal correction completed! Corrected ${correctedCount} terminals.`);
            // 可以添加成功提示
            // this.toastService.success(`已矫正 ${correctedCount} 个终端窗体`);
          }
        } else {
          console.warn(`Terminal ${terminal.instanceId} has no size information, skipping correction`);
        }
      }, index * 100); // 每个终端间隔100ms
    });
  }

  // 获取WebSocket连接状态显示文本
  getWsStatusText(): string {
    switch (this.wsConnectionStatus) {
      case 'connected':
        return this.translateService.instant('webTerminal.wsStatus.connected');
      case 'connecting':
        return this.translateService.instant('webTerminal.wsStatus.connecting');
      case 'error':
        return this.translateService.instant('webTerminal.wsStatus.error');
      case 'disconnected':
      default:
        return this.translateService.instant('webTerminal.wsStatus.disconnected');
    }
  }

  // 获取WebSocket连接状态样式类
  getWsStatusClass(): string {
    switch (this.wsConnectionStatus) {
      case 'connected':
        return 'ws-status-connected';
      case 'connecting':
        return 'ws-status-connecting';
      case 'error':
        return 'ws-status-error';
      case 'disconnected':
      default:
        return 'ws-status-disconnected';
    }
  }

  // 获取连接时长显示
  getConnectionDuration(): string {
    if (!this.wsConnectionTime || this.wsConnectionStatus !== 'connected') {
      return '';
    }
    
    const now = new Date();
    const duration = now.getTime() - this.wsConnectionTime.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}小时${minutes % 60}分钟`;
    } else if (minutes > 0) {
      return `${minutes}分钟${seconds % 60}秒`;
    } else {
      return `${seconds}秒`;
    }
  }
}
