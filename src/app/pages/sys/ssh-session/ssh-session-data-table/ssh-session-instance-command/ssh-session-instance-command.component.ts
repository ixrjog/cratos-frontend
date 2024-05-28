import { Component, Input, OnInit } from '@angular/core';
import { SplitterOrientation } from 'ng-devui';
import { SshSessionService } from '../../../../../@core/services/ssh-session.service';
import { Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { SshCommandPageQuery, SshCommandVO } from '../../../../../@core/data/ssh-session';
import { onFetchData } from '../../../../../@shared/utils/data-table.utli';

@Component({
  selector: 'app-ssh-session-instance-command',
  templateUrl: './ssh-session-instance-command.component.html',
  styleUrls: [ './ssh-session-instance-command.component.less' ],
})
export class SshSessionInstanceCommandComponent implements OnInit {

  size = '50%';
  minSize = '40%';
  maxSize = '60%';
  orientation: SplitterOrientation = 'vertical';
  playLoading: boolean = false;

  queryParam = {
    sshSessionInstanceId: null,
    inputFormatted: '',
  };

  @Input() data: any;

  constructor(private sessionService: SshSessionService) {
  }

  table: Table<SshCommandVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  fetchData() {
    const param: SshCommandPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.sessionService.querySshCommandPage(param));
  }

  ngOnInit(): void {
    this.queryParam.sshSessionInstanceId = this.data['sshSessionInstanceId'];
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

}
