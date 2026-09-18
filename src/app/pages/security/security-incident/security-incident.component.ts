import { Component, HostListener, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Table, TABLE_DATA } from '../../../@core/data/base-data';
import { onFetchData } from '../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../@shared/constant/date.constant';
import { SecurityIncidentService } from '../../../@core/services/security-incident.service';
import {
  SecurityIncidentEdit,
  SecurityIncidentPageQuery,
  SecurityIncidentTimelineEdit,
  SecurityIncidentVO,
} from '../../../@core/data/security-incident';
import { UserService } from '../../../@core/services/user.service';

@Component({
  selector: 'app-security-incident',
  templateUrl: './security-incident.component.html',
  styleUrls: [ './security-incident.component.less' ],
})
export class SecurityIncidentComponent implements OnInit {

  limit = RELATIVE_TIME_LIMIT;

  /** 下拉选项(与后端注释保持一致) */
  readonly typeOptions = [
    { label: '数据泄漏', value: 'DATA_LEAK' },
    { label: '入侵', value: 'INTRUSION' },
    { label: '漏洞利用', value: 'VULN_EXPLOIT' },
    { label: '钓鱼', value: 'PHISHING' },
    { label: '账户滥用', value: 'ACCOUNT_ABUSE' },
    { label: 'DDoS', value: 'DDOS' },
    { label: '配置风险', value: 'CONFIG_RISK' },
    { label: '其它', value: 'OTHER' },
  ];
  readonly severityOptions = [
    { label: 'I 特别重大', value: 'I' },
    { label: 'II 重大', value: 'II' },
    { label: 'III 较大', value: 'III' },
    { label: 'IV 一般', value: 'IV' },
  ];
  readonly statusOptions = [
    { label: '待处置', value: 'OPEN' },
    { label: '调查中', value: 'INVESTIGATING' },
    { label: '已控制', value: 'CONTAINED' },
    { label: '已缓解', value: 'MITIGATED' },
    { label: '已解决', value: 'RESOLVED' },
    { label: '已关闭', value: 'CLOSED' },
    { label: '误报', value: 'FALSE_POSITIVE' },
  ];
  readonly sourceOptions = [
    { label: '风控', value: 'RISK_CONTROL' },
    { label: 'SIEM', value: 'SIEM' },
    { label: '渗透测试', value: 'PENTEST' },
    { label: '外部举报', value: 'EXTERNAL_REPORT' },
    { label: '监管通知', value: 'REGULATOR' },
    { label: '内部巡检', value: 'INTERNAL_AUDIT' },
    { label: '其它', value: 'OTHER' },
  ];
  readonly actionOptions = [
    { label: '发现', value: 'DISCOVER' },
    { label: '分析', value: 'ANALYZE' },
    { label: '控制', value: 'CONTAIN' },
    { label: '缓解', value: 'MITIGATE' },
    { label: '恢复', value: 'RECOVER' },
    { label: '上报', value: 'REPORT' },
    { label: '知会', value: 'NOTIFY' },
    { label: '验证', value: 'VERIFY' },
    { label: '关闭', value: 'CLOSE' },
    { label: '备注', value: 'NOTE' },
  ];

  queryParam = {
    queryName: '',
    incidentType: '',
    severity: '',
    status: '',
    onlyMine: false,
  };

  table: Table<SecurityIncidentVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  /** 用户选择: 服务端搜索(同 sast 页面), 选中后加入下方标签列表实现多人 */
  ownerPick: any = null;
  handlerPick: any = null;

  // ===== 编辑弹窗 =====
  showEditDialog = false;
  editSaving = false;
  isNewIncident = false;
  editForm: SecurityIncidentEdit = this.emptyForm();

  // ===== 详情弹窗(含时间线) =====
  showDetailDialog = false;
  detailLoading = false;
  detail: SecurityIncidentVO = null;
  timelineForm: SecurityIncidentTimelineEdit = null;
  timelineSaving = false;

  constructor(private incidentService: SecurityIncidentService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  /** ESC 关闭弹窗; 详情叠在编辑之上时先关最上层 */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showDetailDialog) {
      this.closeDetailDialog();
      return;
    }
    if (this.showEditDialog) {
      this.closeEditDialog();
    }
  }

  fetchData(): void {
    const param: SecurityIncidentPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.incidentService.queryIncidentPage(param));
  }

  onSearch(): void {
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  pageIndexChange(index: number): void {
    this.table.pager.pageIndex = index;
    this.fetchData();
  }

  pageSizeChange(size: number): void {
    this.table.pager.pageSize = size;
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  // ===== 展示辅助 =====
  labelOf(options: { label: string; value: string }[], value: string): string {
    if (!value) {
      return '';
    }
    const hit = options.find(o => o.value === value);
    return hit ? hit.label : value;
  }

  /** 定级对应的 d-tag 颜色 */
  severityStyle(severity: string): any {
    const colorMap: { [k: string]: string } = {
      I: '#f66f6a',
      II: '#fa9841',
      III: '#fbcb1a',
      IV: '#9b9b9b',
    };
    return { background: colorMap[severity] || '#9b9b9b', color: '#fff' };
  }

  statusStyle(status: string): any {
    const colorMap: { [k: string]: string } = {
      OPEN: '#f66f6a',
      INVESTIGATING: '#fa9841',
      CONTAINED: '#5e7ce0',
      MITIGATED: '#5e7ce0',
      RESOLVED: '#50d4ab',
      CLOSED: '#9b9b9b',
      FALSE_POSITIVE: '#9b9b9b',
    };
    return { background: colorMap[status] || '#9b9b9b', color: '#fff' };
  }

  // ===== 编辑 =====
  openAddDialog(): void {
    this.isNewIncident = true;
    this.editForm = this.emptyForm();
    this.ownerPick = null;
    this.handlerPick = null;
    this.showEditDialog = true;
  }

  openEditDialog(row: SecurityIncidentVO): void {
    this.isNewIncident = false;
    // 详情接口带回大字段(background/handlingProcess 等), 列表不返回
    this.incidentService.getIncidentById({ id: row.id }).subscribe(({ body }: any) => {
      const vo: SecurityIncidentVO = body || row;
      this.editForm = {
        id: vo.id,
        title: vo.title,
        incidentType: vo.incidentType || '',
        severity: vo.severity || '',
        status: vo.status || '',
        source: vo.source || '',
        background: vo.background || '',
        impactScope: vo.impactScope || '',
        handlingProcess: vo.handlingProcess || '',
        rootCause: vo.rootCause || '',
        handlingResult: vo.handlingResult || '',
        postmortemNote: vo.postmortemNote || '',
        dataInvolved: !!vo.dataInvolved,
        reportRequired: !!vo.reportRequired,
        reported: !!vo.reported,
        reportTime: vo.reportTime || null,
        occurTime: vo.occurTime || null,
        discoverTime: vo.discoverTime || null,
        respondTime: vo.respondTime || null,
        containTime: vo.containTime || null,
        recoverTime: vo.recoverTime || null,
        closeTime: vo.closeTime || null,
        followUpGroup: vo.followUpGroup || '',
        comment: vo.comment || '',
        owners: vo.owners || [],
        handlers: vo.handlers || [],
      };
      this.ownerPick = null;
      this.handlerPick = null;
      this.showEditDialog = true;
    });
  }

  closeEditDialog(): void {
    this.showEditDialog = false;
  }

  onSaveIncident(): void {
    if (!this.editForm.title?.trim()) {
      return;
    }
    this.editSaving = true;
    const request = this.isNewIncident
      ? this.incidentService.addIncident(this.editForm)
      : this.incidentService.updateIncident(this.editForm);
    request.subscribe(() => {
      this.editSaving = false;
      this.showEditDialog = false;
      this.fetchData();
    }, () => {
      this.editSaving = false;
    });
  }

  onSetValid(row: SecurityIncidentVO): void {
    this.incidentService.setIncidentValidById({ id: row.id }).subscribe(() => this.fetchData());
  }

  onDelete(row: SecurityIncidentVO): void {
    this.incidentService.deleteIncidentById({ id: row.id }).subscribe(() => this.fetchData());
  }

  // ===== 详情 + 时间线 =====
  openDetailDialog(row: SecurityIncidentVO): void {
    this.showDetailDialog = true;
    this.detailLoading = true;
    this.detail = null;
    this.incidentService.getIncidentById({ id: row.id }).subscribe(({ body }: any) => {
      this.detail = body || null;
      this.detailLoading = false;
      this.resetTimelineForm();
    }, () => {
      this.detailLoading = false;
    });
  }

  closeDetailDialog(): void {
    this.showDetailDialog = false;
    this.detail = null;
  }

  resetTimelineForm(): void {
    if (!this.detail) {
      this.timelineForm = null;
      return;
    }
    this.timelineForm = {
      incidentId: this.detail.id,
      eventTime: this.nowLocalIso(),
      action: 'NOTE',
      content: '',
      attachment: '',
    };
  }

  onSaveTimeline(): void {
    if (!this.timelineForm?.content?.trim() || !this.timelineForm?.eventTime) {
      return;
    }
    this.timelineSaving = true;
    this.incidentService.saveIncidentTimeline(this.timelineForm).subscribe(() => {
      this.timelineSaving = false;
      this.reloadDetail();
    }, () => {
      this.timelineSaving = false;
    });
  }

  onDeleteTimeline(entryId: number): void {
    this.incidentService.deleteIncidentTimelineById({ id: entryId }).subscribe(() => this.reloadDetail());
  }

  private reloadDetail(): void {
    if (!this.detail) {
      return;
    }
    this.incidentService.getIncidentById({ id: this.detail.id }).subscribe(({ body }: any) => {
      this.detail = body || this.detail;
      this.resetTimelineForm();
    });
  }

  /**
   * 用户搜索: 与 sast 页面一致的服务端搜索, 返回 { id, option } 包装体
   * (devui searchFn 的约定; option 才是真实用户对象)
   */
  onSearchUser = (term: string) => {
    return this.userService.queryUserPage({ queryName: term, page: 1, length: 10 })
      .pipe(
        map(({ body }: any) => body.data.map((user: any, index: number) => ({ id: index, option: user }))),
      );
  };

  onOwnerPicked(user: any): void {
    this.addMember(this.editForm.owners, user);
  }

  onHandlerPicked(user: any): void {
    this.addMember(this.editForm.handlers, user);
  }

  removeOwner(username: string): void {
    this.editForm.owners = (this.editForm.owners || []).filter(u => u !== username);
  }

  removeHandler(username: string): void {
    this.editForm.handlers = (this.editForm.handlers || []).filter(u => u !== username);
  }

  private addMember(list: string[], user: any): void {
    const username = user?.username;
    if (!username || !list || list.includes(username)) {
      return;
    }
    list.push(username);
  }

  private emptyForm(): SecurityIncidentEdit {
    return {
      title: '',
      incidentType: '',
      severity: 'IV',
      status: 'OPEN',
      source: '',
      background: '',
      impactScope: '',
      handlingProcess: '',
      rootCause: '',
      handlingResult: '',
      postmortemNote: '',
      dataInvolved: false,
      reportRequired: false,
      reported: false,
      reportTime: null,
      occurTime: null,
      discoverTime: null,
      respondTime: null,
      containTime: null,
      recoverTime: null,
      closeTime: null,
      followUpGroup: '',
      comment: '',
      owners: [],
      handlers: [],
    };
  }

  /** 本地时间的 'yyyy-MM-dd HH:mm:ss', 供 datetime 输入回填 */
  private nowLocalIso(): string {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

}
