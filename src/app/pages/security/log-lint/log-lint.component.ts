import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../@core/services/api.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { UserService } from '../../../@core/services/user.service';
import { map } from 'rxjs/operators';
import { RELATIVE_TIME_LIMIT } from '../../../@shared/constant/date.constant';
import { ActivatedRoute } from '@angular/router';
import { ToastUtil } from '../../../@shared/utils/toast.util';

/**
 * LogLint 日志规约扫描（参考 SAST 页面）
 */
@Component({
  selector: 'app-log-lint',
  templateUrl: './log-lint.component.html',
  styleUrls: ['./log-lint.component.less'],
})
export class LogLintComponent implements OnInit, OnDestroy {

  private static readonly STORAGE_KEY = 'loglint_selected_application';
  private static readonly AUTO_REFRESH_KEY = 'loglint_auto_refresh';

  // Application search & select
  selectedApplication: any = null;
  branch = 'master';

  // Result (application config, 复用 SCA 接口返回)
  result: any = null;
  loading = false;

  // Scan
  scanningProject: string = null;

  // Skill 选择（构建参数）
  skills = [
    { id: 'chief_loglint_expert', label: '日志如诗（日志规约审计）' },
  ];
  selectedSkill = 'chief_loglint_expert';

  // 模型选择（构建参数）
  models = [
    { id: 'claude-sonnet-5', label: 'Sonnet 5' },
    { id: 'claude-opus-5', label: 'Opus 5' },
    { id: 'claude-haiku-45', label: 'Haiku 4.5' },
  ];
  selectedModel = 'claude-sonnet-5';

  onSkillChange(id: any) {
    this.selectedSkill = String(id);
  }

  onModelChange(id: any) {
    this.selectedModel = String(id);
  }

  // Scan history
  scanHistory: any[] = [];
  scanTotal = 0;
  scanPageIndex = 1;
  scanPageSize = 10;
  scanQueryName = '';
  scanLoading = false;
  protected readonly limit = RELATIVE_TIME_LIMIT;
  autoRefresh = true;
  private refreshTimer: any = null;

  constructor(
    private apiService: ApiService,
    private applicationService: ApplicationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastUtil: ToastUtil,
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem(LogLintComponent.STORAGE_KEY);
    if (saved) {
      try {
        this.selectedApplication = JSON.parse(saved);
      } catch (e) {}
    }
    const savedAutoRefresh = localStorage.getItem(LogLintComponent.AUTO_REFRESH_KEY);
    this.autoRefresh = savedAutoRefresh === null ? true : savedAutoRefresh === 'true';
    // 分享链接: 带 scanNo 时先把搜索框填上, 让首次列表查询即按其过滤
    const scanNo = this.route.snapshot.queryParamMap.get('scanNo');
    if (scanNo) {
      this.scanQueryName = scanNo;
    }
    this.queryScanHistory();
    if (this.autoRefresh) {
      this.startAutoRefresh();
    }
    if (scanNo) {
      this.openReportByScanNo(scanNo);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  private openReportByScanNo(scanNo: string) {
    // 分享链接打开: 搜索框自动填入 scanNo 并过滤列表
    this.scanQueryName = scanNo;
    this.scanPageIndex = 1;
    this.apiService.post('/loglint', '/scan/page/query', {
      queryName: scanNo,
      page: 1,
      length: 20,
    }).subscribe(({ body }: any) => {
      this.scanHistory = (body.data || []).map((row: any) => {
        const usage = this.parseTokenUsage(row.tokenUsage);
        row.totalTokens = usage ? (usage.total_tokens
          ?? ((usage.input_tokens || 0) + (usage.output_tokens || 0)
            + (usage.cache_read_input_tokens || 0) + (usage.cache_creation_input_tokens || 0))) : null;
        return row;
      });
      this.scanTotal = body.totalNum || 0;
      const match = (body.data || []).find((s: any) => s.scanNo === scanNo);
      if (match) {
        this.onViewReport(match);
      }
    });
  }

  onAutoRefreshChange(enabled: boolean) {
    localStorage.setItem(LogLintComponent.AUTO_REFRESH_KEY, enabled ? 'true' : 'false');
    if (enabled) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  private startAutoRefresh() {
    this.stopAutoRefresh();
    this.refreshTimer = setInterval(() => {
      this.queryScanHistory(true);
    }, 10000);
  }

  private stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  onSearchApplication = (term: string) => {
    return this.applicationService.queryApplicationPage({ queryName: term, page: 1, length: 20 })
      .pipe(
        map(({ body }) => body.data.map((app: any, index: number) => ({ id: index, option: app }))),
      );
  };

  onApplicationChange(app: any) {
    this.selectedApplication = app;
    this.result = null;
    if (app) {
      localStorage.setItem(LogLintComponent.STORAGE_KEY, JSON.stringify({ name: app.name, comment: app.comment }));
    } else {
      localStorage.removeItem(LogLintComponent.STORAGE_KEY);
    }
  }

  onQuery() {
    if (!this.selectedApplication?.name) {
      return;
    }
    this.loading = true;
    this.result = null;
    this.apiService.post('/loglint', '/application/config/query', {
      applicationName: this.selectedApplication.name,
      branch: this.branch || 'master',
    }).subscribe(({ body }: any) => {
      this.result = body;
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  onScan(build: any) {
    if (!this.selectedApplication?.name || !build?.project) {
      return;
    }
    this.scanningProject = build.project;
    this.apiService.post('/loglint', '/application/scan', {
      applicationName: this.selectedApplication.name,
      branch: this.branch || 'master',
      project: build.project,
      skill: this.selectedSkill,
      model: this.selectedModel,
    }).subscribe(() => {
      this.scanningProject = null;
      this.queryScanHistory();
    }, () => {
      this.scanningProject = null;
    });
  }

  queryScanHistory(silent = false) {
    if (!silent) {
      this.scanLoading = true;
    }
    this.apiService.post('/loglint', '/scan/page/query', {
      queryName: this.scanQueryName,
      page: this.scanPageIndex,
      length: this.scanPageSize,
    }).subscribe(({ body }: any) => {
      this.scanHistory = (body.data || []).map((row: any) => {
        const usage = this.parseTokenUsage(row.tokenUsage);
        row.totalTokens = usage ? (usage.total_tokens
          ?? ((usage.input_tokens || 0) + (usage.output_tokens || 0)
            + (usage.cache_read_input_tokens || 0) + (usage.cache_creation_input_tokens || 0))) : null;
        return row;
      });
      this.scanTotal = body.totalNum || 0;
      this.scanLoading = false;
    }, () => {
      this.scanLoading = false;
    });
  }

  onScanPageIndexChange(pageIndex: number) {
    this.scanPageIndex = pageIndex;
    this.queryScanHistory();
  }

  onScanPageSizeChange(pageSize: number) {
    this.scanPageSize = pageSize;
    this.scanPageIndex = 1;
    this.queryScanHistory();
  }

  onScanSearch() {
    this.scanPageIndex = 1;
    this.queryScanHistory();
  }

  onDeleteScan(rowItem: any) {
    if (!confirm('Confirm delete this scan record?')) {
      return;
    }
    this.apiService.delete('/loglint', '/scan/del', { id: rowItem.id })
      .subscribe(() => {
        this.queryScanHistory();
      });
  }

  /**
   * 从已完成的 Jenkins 构建恢复报告（进程中断后修复用）
   */
  onRecoverReport(rowItem: any) {
    if (rowItem.recovering) {
      return;
    }
    rowItem.recovering = true;
    this.apiService.post('/loglint', '/scan/report/recover?scanId=' + rowItem.id, {})
      .subscribe(() => {
        rowItem.recovering = false;
        this.queryScanHistory();
      }, () => {
        rowItem.recovering = false;
      });
  }

  getBuildUrl(rowItem: any): string {
    if (rowItem.queueRef) {
      try {
        const url = new URL(rowItem.queueRef.replace('http://', 'https://'));
        return `${url.origin}/job/${rowItem.jobName}/${rowItem.buildId}/`;
      } catch (e) {}
    }
    return '#';
  }

  humanizeDuration(ms: number): string {
    if (!ms || ms <= 0) {
      return '';
    }
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) {
      return `${h} 小时 ${m} 分`;
    }
    if (m > 0) {
      return `${m} 分 ${s} 秒`;
    }
    return `${s} 秒`;
  }

  // Report dialog
  showReportDialog = false;
  reportLoading = false;
  reportScan: any = null;
  reportContent = '';
  tokenUsage: any = null;
  remediationContent = '';

  /** 基于某行 scanNo 的分享链接: 打开后直接查看报告 */
  rowShareUrl(row: any): string {
    const no = row?.scanNo;
    return no ? `${window.location.origin}/#/pages/security/loglint?scanNo=${no}` : '';
  }

  /** 复制某行的分享链接 */
  onShare(row: any) {
    const url = this.rowShareUrl(row);
    if (!url) {
      return;
    }
    this.copyText(url);
  }

  private copyText(text: string) {
    const done = () => this.toastUtil.onSuccessToast('分享链接已复制');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(done)
        .catch(() => this.fallbackCopy(text, done));
    } else {
      this.fallbackCopy(text, done);
    }
  }

  private fallbackCopy(text: string, done: () => void) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      done();
    } catch (e) {}
    document.body.removeChild(ta);
  }

  onViewReport(rowItem: any) {
    this.reportScan = rowItem;
    this.reportContent = '';
    this.tokenUsage = null;
    this.remediationContent = '';
    this.showReportDialog = true;
    this.fetchReport(rowItem.id);
  }

  private fetchReport(scanId: number) {
    this.reportLoading = true;
    this.apiService.post('/loglint', '/scan/report/query', {
      scanId,
    }).subscribe(({ body }: any) => {
      this.reportContent = (body && body.lintReport) || '';
      this.tokenUsage = this.parseTokenUsage(body && body.tokenUsage);
      this.remediationContent = (body && body.remediationNote) || '';
      this.reportLoading = false;
    }, () => {
      this.reportLoading = false;
    });
  }

  private parseTokenUsage(raw: any): any {
    if (!raw) {
      return null;
    }
    if (typeof raw === 'object') {
      return raw;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  /**
   * 导出日志规约报告 Markdown（附带扫描元信息头部）
   */
  onExportReport() {
    if (!this.reportContent) {
      return;
    }
    const s = this.reportScan || {};
    const lines: string[] = [];
    lines.push(`- **Application**: ${s.applicationName || '-'}`);
    if (s.scanNo) {
      lines.push(`- **Scan No**: ${s.scanNo}`);
    }
    lines.push(`- **Git URL**: ${s.gitUrl || '-'}`);
    lines.push(`- **Branch**: ${s.branch || '-'}`);
    lines.push(`- **Commit**: ${s.commitId || '-'}`);
    lines.push(`- **Scan Time**: ${s.createTime ? new Date(s.createTime).toLocaleString() : '-'}`);
    lines.push(`- **Operator**: ${s.username || '-'}`);
    lines.push(`- **AI Model**: ${s.aiModel || '-'}`);
    if (s.scanNo) {
      lines.push(`- **Link**: ${window.location.origin}/#/pages/security/loglint?scanNo=${s.scanNo}`);
    }
    lines.push('');
    lines.push('---');
    lines.push('');
    const markdown = lines.join('\n') + this.reportContent;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeApp = (s.applicationName || 'loglint').replace(/[^\w.-]+/g, '_');
    a.download = `${safeApp}-log-lint-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ===== 行编辑：跟进群 / 负责人 =====
  showConfigDialog = false;
  configSaving = false;
  configScan: any = null;
  configFollowUpGroup = '';
  selectedOfficer: any = null;
  configRemediationNote = '';
  officerOptions: string[] = [];

  onEditConfig(rowItem: any) {
    this.configScan = rowItem;
    this.configFollowUpGroup = rowItem.followUpGroup || '';
    this.selectedOfficer = rowItem.securityOfficer ? { username: rowItem.securityOfficer } : null;
    this.configRemediationNote = rowItem.remediationNote || '';
    this.showConfigDialog = true;
    this.loadOfficerOptions();
  }

  private loadOfficerOptions() {
    this.apiService.post('/loglint', '/scan/officers/query', {})
      .subscribe(({ body }: any) => {
        this.officerOptions = body || [];
      }, () => {
        this.officerOptions = [];
      });
  }

  pickOfficer(username: string) {
    this.selectedOfficer = { username };
  }

  onOfficerTabChange(id: any) {
    this.selectedOfficer = { username: String(id) };
  }

  // 查看处理结果(Markdown)
  showRemediationDialog = false;
  remediationViewContent = '';
  remediationViewApp = '';

  onViewRemediation(rowItem: any) {
    this.remediationViewContent = rowItem.remediationNote || '';
    this.remediationViewApp = rowItem.applicationName || '';
    this.showRemediationDialog = true;
  }

  onSearchUser = (term: string) => {
    return this.userService.queryUserPage({ queryName: term, page: 1, length: 10 })
      .pipe(
        map(({ body }: any) => body.data.map((user: any, index: number) => ({ id: index, option: user }))),
      );
  };

  onOfficerChange(user: any) {
    this.selectedOfficer = user || null;
  }

  onSaveConfig() {
    if (!this.configScan) {
      return;
    }
    this.configSaving = true;
    this.apiService.post('/loglint', '/scan/config/update', {
      scanId: this.configScan.id,
      followUpGroup: this.configFollowUpGroup || null,
      securityOfficer: this.selectedOfficer?.username || null,
      remediationNote: this.configRemediationNote || null,
    }).subscribe(() => {
      this.configSaving = false;
      this.showConfigDialog = false;
      this.queryScanHistory();
    }, () => {
      this.configSaving = false;
    });
  }
}
