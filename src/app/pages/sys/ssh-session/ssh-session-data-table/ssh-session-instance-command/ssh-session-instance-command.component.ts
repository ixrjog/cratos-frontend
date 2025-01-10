import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SshSessionService } from '../../../../../@core/services/ssh-session.service';
import { Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import {
  OutputMessage,
  SshAuditPlayMessage,
  SshCommandPageQuery,
  SshCommandVO,
} from '../../../../../@core/data/ssh-session';
import { onFetchData } from '../../../../../@shared/utils/data-table.utli';
import { WebSocketApiService, WsMessageTopicEnum } from '../../../../../@core/services/ws.api.service';
import { Subscription, timer } from 'rxjs';
import { XtermLogsComponent } from '../../../../../@shared/components/common/xterm-logs/xterm-logs.component';
import { ToastUtil } from '../../../../../@shared/utils/toast.util';
import { WS_HEART_INTERVAL, WS_INIT_INTERVAL } from '../../../../../@shared/constant/ws.constant';

@Component({
  selector: 'app-ssh-session-instance-command',
  templateUrl: './ssh-session-instance-command.component.html',
  styleUrls: [ './ssh-session-instance-command.component.less' ],
})
export class SshSessionInstanceCommandComponent implements OnInit, OnDestroy {

  @ViewChild('sshAuditPlayTerm') private sshAuditPlayTerm: XtermLogsComponent;

  collapsed: boolean = true;
  queryParam = {
    sshSessionInstanceId: null,
    inputFormatted: '',
  };
  instanceId: string;
  sessionId: string;
  @Input() data: any;
  table: Table<SshCommandVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  ws: WebSocket;
  timerRequest: Subscription;
  wsHeartbeatTimerRequest: Subscription;

  constructor(private sessionService: SshSessionService,
              private wsApiService: WebSocketApiService,
              private toastUtil: ToastUtil) {
  }

  wsOnInit() {
    this.ws = this.wsApiService.createWsClient('/ssh/audit');
  }

  onWsHeartbeat() {
    this.wsHeartbeatTimerRequest = timer(5000, WS_HEART_INTERVAL)
      .subscribe(num => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.wsApiService.onPing(this.ws);
        }
      });
  }

  fetchData() {
    const param: SshCommandPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.sessionService.querySshCommandPage(param));
  }

  ngOnInit(): void {
    this.wsOnInit();
    this.wsOnOpen();
    this.wsOnMessage();
    this.queryParam.sshSessionInstanceId = this.data['sshSessionInstanceId'];
    this.instanceId = this.data['instanceId'];
    this.sessionId = this.data['sessionId'];
    this.fetchData();
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

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
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
        this.wsOnSend();
      } catch (error) {
      }
    };
  }

  wsOnSend() {
    const param: SshAuditPlayMessage = {
      topic: WsMessageTopicEnum.PLAY_SSH_SESSION_AUDIT,
      sessionId: this.sessionId,
      instanceId: this.instanceId,
    };
    this.ws.send(JSON.stringify(param));
  }

  wsOnMessage() {
    this.ws.onmessage = (event) => {
      let msg: OutputMessage = JSON.parse(event.data);
      if (msg.code === 0) {
        this.sshAuditPlayTerm.onWrite(msg.output);
        return;
      }
      this.toastUtil.onErrorToast(msg.error, { width: '600px' });
    };
  }

}
