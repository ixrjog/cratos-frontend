import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../@core/services/api.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { UserService } from '../../../@core/services/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RELATIVE_TIME_LIMIT } from '../../../@shared/constant/date.constant';
import { ActivatedRoute } from '@angular/router';
import { getPopoverStyle } from '../../../@shared/utils/theme.util';

@Component({
  selector: 'app-sast',
  templateUrl: './sast.component.html',
  styleUrls: ['./sast.component.less'],
})
export class SastComponent implements OnInit, OnDestroy {

  private static readonly STORAGE_KEY = 'sast_selected_application';
  private static readonly AUTO_REFRESH_KEY = 'sast_auto_refresh';

  /** 主题感知的 popover 样式(亮/暗自适应) */
  readonly getPopoverStyle = getPopoverStyle;

  // Application search & select
  selectedApplication: any = null;
  branch = 'master';

  // Result (application config, 复用 SCA 接口返回)
  result: any = null;
  loading = false;

  // Scan
  scanningProject: string = null;

  // Skill 选择（构建参数），当前仅一个
  skills = [
    { id: 'chief_security_expert', label: '首席安全专家' },
  ];
  selectedSkill = 'chief_security_expert';

  // 模型选择（构建参数），eu-central-1 可用
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
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem(SastComponent.STORAGE_KEY);
    if (saved) {
      try {
        this.selectedApplication = JSON.parse(saved);
      } catch (e) {}
    }
    const savedAutoRefresh = localStorage.getItem(SastComponent.AUTO_REFRESH_KEY);
    this.autoRefresh = savedAutoRefresh === null ? true : savedAutoRefresh === 'true';
    this.queryScanHistory();
    if (this.autoRefresh) {
      this.startAutoRefresh();
    }
    // URL 带 scanNo 时直接打开对应扫描的报告
    const scanNo = this.route.snapshot.queryParamMap.get('scanNo');
    if (scanNo) {
      this.openReportByScanNo(scanNo);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  private openReportByScanNo(scanNo: string) {
    this.apiService.post('/sast', '/scan/page/query', {
      queryName: scanNo,
      page: 1,
      length: 20,
    }).subscribe(({ body }: any) => {
      const match = (body.data || []).find((s: any) => s.scanNo === scanNo);
      if (match) {
        this.onViewReport(match);
      }
    });
  }

  onAutoRefreshChange(enabled: boolean) {
    localStorage.setItem(SastComponent.AUTO_REFRESH_KEY, enabled ? 'true' : 'false');
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

  // 安全故障定级规范文档
  showPolicyDialog = false;
  policyContent = '';

  onOpenPolicy() {
    this.showPolicyDialog = true;
    if (!this.policyContent) {
      fetch('assets/docs/security-vulnerability-grading-and-postmortem-policy.md')
        .then(r => r.text())
        .then(t => this.policyContent = t)
        .catch(() => this.policyContent = '文档加载失败');
    }
  }

  onExportPolicy() {
    if (!this.policyContent) {
      return;
    }
    const blob = new Blob([this.policyContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security-vulnerability-grading-and-postmortem-policy.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      localStorage.setItem(SastComponent.STORAGE_KEY, JSON.stringify({ name: app.name, comment: app.comment }));
    } else {
      localStorage.removeItem(SastComponent.STORAGE_KEY);
    }
  }

  /** 取最新 N 条扫描(按创建时间倒序), 用于 build 卡片只展示最近几条 */
  latestScans(tasks: any[], n = 2): any[] {
    if (!tasks || !tasks.length) {
      return [];
    }
    return [...tasks].sort((a, b) =>
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime()).slice(0, n);
  }

  /** 从扫描历史行"重新扫描": 把应用+分支填入顶部搜索项并重新查询构建 */
  onRescan(rowItem: any) {
    if (!rowItem?.applicationName) {
      return;
    }
    this.onApplicationChange({ name: rowItem.applicationName, comment: rowItem.applicationName });
    this.branch = (rowItem.branch || 'master').trim() || 'master';
    this.onQuery();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {}
  }

  onQuery() {
    if (!this.selectedApplication?.name) {
      return;
    }
    this.loading = true;
    this.result = null;
    // 应用配置查询复用 SCA 的返回结构
    this.apiService.post('/sast', '/application/config/query', {
      applicationName: this.selectedApplication.name,
      branch: (this.branch || '').trim() || 'master',
    }).subscribe(({ body }: any) => {
      this.result = body;
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  // ===== 选择 Project 弹窗（按分支查配置，列出 builds 供选择；分支选项复用 SCA 接口） =====
  showBuildPicker = false;
  buildPickerLoading = false;
  buildPickerList: any[] = [];
  selectedBuild: any = null;
  branchOptionsLoading = false;
  branchSelectOptions: any[] = []; // 扁平: [{ label, value, group, desc }]
  selectedBranchOption: any = null; // d-select 绑定的选项对象
  selectedBranch: string = null;    // 派生的分支名字符串

  /** 分支框 d-search 的搜索动作: 弹出 project 选择 */
  onBranchSearch() {
    this.openBuildPicker();
  }

  /** 打开选择 project 弹窗: 按当前应用+分支查配置, 列出 builds(project + gitUrl) */
  openBuildPicker() {
    if (!this.selectedApplication?.name) {
      return;
    }
    this.showBuildPicker = true;
    this.buildPickerLoading = true;
    this.buildPickerList = [];
    this.apiService.post('/sast', '/application/config/query', {
      applicationName: this.selectedApplication.name,
      branch: (this.branch || '').trim() || 'master',
    }).subscribe(({ body }: any) => {
      this.buildPickerList = (body?.builds || []).map((b: any) => ({
        project: b.project || b.moduleName || '',
        gitUrl: b?.buildProject?.repository?.sshUrl || '',
        raw: b,
      }));
      this.selectedBuild = null;
      this.branchSelectOptions = [];
      this.selectedBranchOption = null;
      this.selectedBranch = null;
      if (this.buildPickerList.length === 1) {
        this.onSelectBuild(this.buildPickerList[0]);
      }
      this.buildPickerLoading = false;
    }, () => {
      this.buildPickerList = [];
      this.buildPickerLoading = false;
    });
  }

  closeBuildPicker() {
    this.showBuildPicker = false;
  }

  /** 选中一个 project 后, 复用 SCA 接口查询该 build(gitUrl)的 GitLab 分支选项 */
  onSelectBuild(item: any) {
    if (!item?.gitUrl) {
      return;
    }
    this.selectedBuild = item;
    this.branchSelectOptions = [];
    this.selectedBranchOption = null;
    this.selectedBranch = null;
    this.branchOptionsLoading = true;
    this.apiService.post('/sca', '/build/branch-options/query', {
      gitUrl: item.gitUrl,
      openTag: false,
    }).subscribe(({ body }: any) => {
      const groups = body?.options || [];
      const multiGroup = groups.length > 1;
      const flat: any[] = [];
      groups.forEach((g: any) => {
        (g.options || []).forEach((opt: any) => {
          flat.push({
            value: opt.value,
            label: multiGroup ? `[${g.label}] ${opt.label}` : opt.label,
            group: g.label,
            desc: opt.desc || opt.commitMessage || '',
          });
        });
      });
      this.branchSelectOptions = flat;
      this.selectedBranchOption = flat[0] || null;
      this.selectedBranch = flat[0] ? flat[0].value : null;
      this.branchOptionsLoading = false;
    }, () => {
      this.branchSelectOptions = [];
      this.branchOptionsLoading = false;
    });
  }

  /** d-select 选中变化: 派生分支名字符串 */
  onBranchChange(opt: any) {
    this.selectedBranch = opt ? opt.value : null;
  }

  /** d-select 前端搜索: 按 label 过滤分支/Tag (返回 devui 期望的 {id, option} 包裹结构) */
  onSearchBranch = (term: string) => {
    const t = (term || '').toLowerCase();
    const list = this.branchSelectOptions
      .filter(o => (o.label || '').toLowerCase().includes(t))
      .map((o, index) => ({ id: index, option: o }));
    return new Observable<any[]>((observer) => {
      observer.next(list);
      observer.complete();
    });
  };

  /** 确认分支: 填回主搜索的分支输入框并关闭弹窗 */
  confirmBranch() {
    if (this.selectedBranch) {
      this.branch = this.selectedBranch;
    }
    this.showBuildPicker = false;
  }

  onScan(build: any) {
    if (!this.selectedApplication?.name || !build?.project) {
      return;
    }
    this.scanningProject = build.project;
    this.apiService.post('/sast', '/application/scan', {
      applicationName: this.selectedApplication.name,
      branch: (this.branch || '').trim() || 'master',
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
    this.apiService.post('/sast', '/scan/page/query', {
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
    this.apiService.delete('/sast', '/scan/del', { id: rowItem.id })
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
    this.apiService.post('/sast', '/scan/report/recover?scanId=' + rowItem.id, {})
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

  /**
   * 将扫描时长(毫秒)人性化展示，如 "1 小时 28 分" / "3 分 5 秒" / "42 秒"
   */
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
    this.apiService.post('/sast', '/scan/report/query', {
      scanId,
    }).subscribe(({ body }: any) => {
      this.reportContent = (body && body.securityReport) || '';
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
   * 导出安全报告 Markdown（附带扫描元信息头部）
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
      lines.push(`- **Link**: ${window.location.origin}/#/pages/security/sast?scanNo=${s.scanNo}`);
    }
    lines.push('');
    lines.push('---');
    lines.push('');
    const markdown = lines.join('\n') + this.reportContent;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeApp = (s.applicationName || 'sast').replace(/[^\w.-]+/g, '_');
    a.download = `${safeApp}-security-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * 风险等级对应的背景色
   */
  riskColor(level: string): string {
    switch ((level || '').toUpperCase()) {
      case 'CRITICAL': return 'rgb(217, 48, 37)';
      case 'HIGH': return 'rgb(255, 106, 13)';
      case 'MEDIUM': return 'rgb(250, 173, 20)';
      case 'LOW': return 'rgb(140, 140, 140)';
      default: return 'rgb(140, 140, 140)';
    }
  }

  // ===== 行编辑：跟进群 / 安全负责人 =====
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

  /**
   * 加载历史记录中出现过的安全负责人(去重),用于快捷选择
   */
  private loadOfficerOptions() {
    this.apiService.post('/sast', '/scan/officers/query', {})
      .subscribe(({ body }: any) => {
        this.officerOptions = body || [];
      }, () => {
        this.officerOptions = [];
      });
  }

  /**
   * 快捷选择安全负责人
   */
  pickOfficer(username: string) {
    this.selectedOfficer = { username };
  }

  onOfficerTabChange(id: any) {
    this.selectedOfficer = { username: String(id) };
  }

  // ===== SCA 组件查看弹窗 =====
  showScaComponentsDialog = false;
  scaComponentsLoading = false;
  scaComponentsAll: any[] = [];
  scaComponentsList: any[] = [];
  scaComponentsApp = '';
  scaComponentsGroupId = '';
  scaComponentsArtifactId = '';
  scaComponentsVersionFilter = 'ALL';
  scaSnapshotCount = 0;
  scaReleaseCount = 0;
  scaVulnerableCount = 0;

  /**
   * 打开关联 SCA 扫描的组件列表(当前页弹窗)。
   */
  openScaComponents(scaScan: any) {
    if (!scaScan || !scaScan.id) {
      return;
    }
    this.scaComponentsApp = scaScan.applicationName || '';
    this.scaComponentsGroupId = '';
    this.scaComponentsArtifactId = '';
    this.scaComponentsVersionFilter = 'ALL';
    this.showScaComponentsDialog = true;
    this.scaComponentsLoading = true;
    this.apiService.post('/sca', '/scan/components/query', { scanId: scaScan.id })
      .subscribe(({ body }: any) => {
        this.scaComponentsAll = body || [];
        this.scaSnapshotCount = this.scaComponentsAll.filter((c: any) => (c.version || '').toUpperCase().includes('SNAPSHOT')).length;
        this.scaReleaseCount = this.scaComponentsAll.length - this.scaSnapshotCount;
        this.scaVulnerableCount = this.scaComponentsAll.filter((c: any) => c.vulnerability).length;
        this.filterScaComponents();
        this.scaComponentsLoading = false;
      }, () => {
        this.scaComponentsLoading = false;
      });
  }

  onScaComponentsSearch() {
    this.filterScaComponents();
  }

  onScaVersionFilterChange(id: any) {
    this.scaComponentsVersionFilter = String(id);
    this.filterScaComponents();
  }

  private filterScaComponents() {
    const groupId = this.scaComponentsGroupId.toLowerCase();
    const artifactId = this.scaComponentsArtifactId.toLowerCase();
    this.scaComponentsList = this.scaComponentsAll.filter((c: any) => {
      if (groupId && !(c.groupId || '').toLowerCase().includes(groupId)) return false;
      if (artifactId && !(c.artifactId || '').toLowerCase().includes(artifactId)) return false;
      if (this.scaComponentsVersionFilter === 'SNAPSHOT' && !(c.version || '').toUpperCase().includes('SNAPSHOT')) return false;
      if (this.scaComponentsVersionFilter === 'RELEASE' && (c.version || '').toUpperCase().includes('SNAPSHOT')) return false;
      if (this.scaComponentsVersionFilter === 'VULNERABLE' && !c.vulnerability) return false;
      return true;
    });
  }

  /**
   * 解析 SCA languageStats(JSON 字符串)为语言分布数组,用于 SCA 列代码行数 popover。
   */
  parseLangs(languageStats: string): any[] {
    if (!languageStats) {
      return [];
    }
    try {
      const arr = JSON.parse(languageStats);
      return Array.isArray(arr) ? arr.slice(0, 8) : [];
    } catch (e) {
      return [];
    }
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
    this.apiService.post('/sast', '/scan/config/update', {
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
