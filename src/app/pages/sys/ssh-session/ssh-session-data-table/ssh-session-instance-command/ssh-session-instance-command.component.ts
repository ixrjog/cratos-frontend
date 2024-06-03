import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SshSessionService } from '../../../../../@core/services/ssh-session.service';
import { Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { SshAuditPlayMessage, SshCommandPageQuery, SshCommandVO } from '../../../../../@core/data/ssh-session';
import { onFetchData } from '../../../../../@shared/utils/data-table.utli';
import { WebSocketApiService } from '../../../../../@core/services/ws.api.service';
import { Subscription, timer } from 'rxjs';
import { XtermLogsComponent } from '../../../../../@shared/components/common/xterm-logs/xterm-logs.component';

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

  constructor(private sessionService: SshSessionService,
              private wsApiService: WebSocketApiService) {
  }

  wsOnInit() {
    this.ws = this.wsApiService.createWsClient('/ssh/audit');
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
  }

  ngOnDestroy(): void {
    try {
      this.timerRequest.unsubscribe();
      this.ws.close();
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
    this.timerRequest = timer(1000, 1000)
      .subscribe(num => {
        if (this.ws?.readyState !== 1) {
          this.wsOnInit();
          if (!this.collapsed) {
            this.wsOnOpen();
            this.wsOnMessage();
          }
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
      state: 'PLAY',
      sessionId: this.sessionId,
      instanceId: this.instanceId,
    };
    this.ws.send(JSON.stringify(param));
  }

  wsOnMessage() {
    this.ws.onmessage = (event) => {
      let msg = JSON.parse(event.data);
      this.sshAuditPlayTerm.onWrite(msg['output']);
    };
  }

}
