import { Component, OnInit } from '@angular/core';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import {
  SshInstanceVO,
  SshSessionPageQuery,
  SshSessionTypeEnum,
  SshSessionVO,
  SshShellEventType,
} from '../../../../@core/data/ssh-session';
import { SshSessionService } from '../../../../@core/services/ssh-session.service';
import { UserPageQuery, UserVO } from '../../../../@core/data/user';
import { map } from 'rxjs/operators';
import { UserService } from '../../../../@core/services/user.service';
import { DialogService } from 'ng-devui';
import {
  SshSessionInstanceCommandComponent,
} from './ssh-session-instance-command/ssh-session-instance-command.component';
import { countResource } from '../../../../@shared/utils/resource-count.util';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-ssh-session-data-table',
  templateUrl: './ssh-session-data-table.component.html',
  styleUrls: [ './ssh-session-data-table.component.less' ],
})
export class SshSessionDataTableComponent implements OnInit {

  private static STORAGE_KEY = 'ssh-session-query';

  queryParam = {
    username: '',
    sessionStatus: '',
    sessionType: '',
  };
  user: UserVO;
  protected readonly limit = RELATIVE_TIME_LIMIT;
  businessType: string = BusinessTypeEnum.SSH_SESSION;

  sessionTypeOptions = [
    SshSessionTypeEnum.SSH_SERVER,
    SshSessionTypeEnum.WEB_SHELL,
    SshSessionTypeEnum.WEB_KUBERNETES_SHELL,
  ];

  sessionStatusOptions = [
    SshShellEventType.SESSION_STARTED, SshShellEventType.SESSION_STOPPED,
    SshShellEventType.SESSION_STOPPED_UNEXPECTEDLY, SshShellEventType.SESSION_DESTROYED,
  ];

  table: Table<SshSessionVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(private sessionService: SshSessionService,
              private userService: UserService,
              private dialogService: DialogService) {
  }

  fetchData() {
    sessionStorage.setItem(SshSessionDataTableComponent.STORAGE_KEY, JSON.stringify(this.queryParam));
    const param: SshSessionPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.sessionService.querySshSessionPage(param));
  }

  ngOnInit() {
    const saved = sessionStorage.getItem(SshSessionDataTableComponent.STORAGE_KEY);
    if (saved) {
      Object.assign(this.queryParam, JSON.parse(saved));
    }
    this.fetchData();
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  onSearchUser = (term: string) => {
    const param: UserPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.userService.queryUserPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((user, index) => ({ id: index, option: user })),
        ),
      );
  };

  onUserChange(user: UserVO) {
    this.queryParam.username = user?.username;
  }

  onRowClick(row: SshInstanceVO) {
    this.dialogService.open({
      id: 'ssh-session-audit',
      width: '60%',
      maxHeight: '1000px',
      backdropCloseable: true,
      showCloseBtn: false,
      escapable: true,
      dialogtype: 'standard',
      content: SshSessionInstanceCommandComponent,
      buttons: [],
      data: {
        instanceId: row.instanceId,
        sshSessionInstanceId: row.id,
        sessionId: row.sessionId,
      },
      });
  }

  protected readonly countResource = countResource;

  getSessionStatusStyle(status: string): string {
    switch (status) {
      case SshShellEventType.SESSION_STARTED: return 'green-w98';
      case SshShellEventType.SESSION_STOPPED: return 'default';
      case SshShellEventType.SESSION_STOPPED_UNEXPECTEDLY: return 'red-w98';
      case SshShellEventType.SESSION_DESTROYED: return 'orange-w98';
      default: return 'blue-w98';
    }
  }
}
