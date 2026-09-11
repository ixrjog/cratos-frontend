import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../@core/services/api.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { map } from 'rxjs/operators';
import { RELATIVE_TIME_LIMIT } from '../../../@shared/constant/date.constant';
import { ActivatedRoute } from '@angular/router';
import { getPopoverStyle } from '../../../@shared/utils/theme.util';

@Component({
  selector: 'app-sca',
  templateUrl: './sca.component.html',
  styleUrls: ['./sca.component.less'],
})
export class ScaComponent implements OnInit, OnDestroy {

  private static readonly STORAGE_KEY = 'sca_selected_application';

  /** 主题感知的 popover 样式(亮/暗自适应) */
  readonly getPopoverStyle = getPopoverStyle;

  // Application search & select
  selectedApplication: any = null;
  branch = 'master';

  // Result
  result: any = null;
  loading = false;

  // Scan
  scanningProject: string = null;

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
  private static readonly AUTO_REFRESH_KEY = 'sca_auto_refresh';

  constructor(
    private apiService: ApiService,
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem(ScaComponent.STORAGE_KEY);
    if (saved) {
      try {
        this.selectedApplication = JSON.parse(saved);
      } catch (e) {}
    }
    // 读取自动刷新持久化设置（默认开启）
    const savedAutoRefresh = localStorage.getItem(ScaComponent.AUTO_REFRESH_KEY);
    this.autoRefresh = savedAutoRefresh === null ? true : savedAutoRefresh === 'true';
    this.queryScanHistory();
    if (this.autoRefresh) {
      this.startAutoRefresh();
    }
    // URL 带 scanNo 时直接打开对应扫描的 Components
    const scanNo = this.route.snapshot.queryParamMap.get('scanNo');
    if (scanNo) {
      this.openComponentsByScanNo(scanNo);
    }
  }

  /**
   * 按 scanNo 查到扫描记录并打开 Components 弹窗
   */
  private openComponentsByScanNo(scanNo: string) {
    this.apiService.post('/sca', '/scan/page/query', {
      queryName: scanNo,
      page: 1,
      length: 20,
    }).subscribe(({ body }: any) => {
      const match = (body.data || []).find((s: any) => s.scanNo === scanNo);
      if (match) {
        this.onViewComponents(match);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  onAutoRefreshChange(enabled: boolean) {
    localStorage.setItem(ScaComponent.AUTO_REFRESH_KEY, enabled ? 'true' : 'false');
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
      localStorage.setItem(ScaComponent.STORAGE_KEY, JSON.stringify({ name: app.name, comment: app.comment }));
    } else {
      localStorage.removeItem(ScaComponent.STORAGE_KEY);
    }
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
    this.apiService.post('/sca', '/application/config/query', {
      applicationName: this.selectedApplication.name,
      branch: (this.branch || '').trim() || 'master',
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
    this.apiService.post('/sca', '/application/scan', {
      applicationName: this.selectedApplication.name,
      branch: (this.branch || '').trim() || 'master',
      project: build.project,
    }).subscribe(() => {
      this.scanningProject = null;
      // 触发后刷新历史
      this.queryScanHistory();
    }, () => {
      this.scanningProject = null;
    });
  }

  queryScanHistory(silent = false) {
    if (!silent) {
      this.scanLoading = true;
    }
    this.apiService.post('/sca', '/scan/page/query', {
      queryName: this.scanQueryName,
      page: this.scanPageIndex,
      length: this.scanPageSize,
    }).subscribe(({ body }: any) => {
      this.scanHistory = body.data || [];
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
    this.apiService.delete('/sca', '/scan/del', { id: rowItem.id })
      .subscribe(() => {
        this.queryScanHistory();
      });
  }

  getBuildUrl(rowItem: any): string {
    // 从 queueRef 提取 Jenkins base URL，拼接 job/buildId
    // queueRef 格式: http://jan-jenkins-1.palmpay-inc.com/queue/item/77/
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

  /**
   * 解析 languageStats(JSON 字符串)为语言分布数组,用于代码行数 popover。
   * 结构: [{ language, code, comment, files }],取前若干项。
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

  // Components dialog
  showComponentsDialog = false;
  componentsList: any[] = [];
  allComponents: any[] = [];

  // 内部模块弹窗
  showInternalModulesDialog = false;
  internalModulesLoading = false;
  internalModulesList: any[] = [];
  internalModulesScanApp = '';
  componentsLoading = false;
  snapshotCount = 0;
  releaseCount = 0;
  vulnerableCount = 0;
  componentsGroupId = '';
  componentsArtifactId = '';
  componentsPasteInput = '';
  componentsVersionFilter = 'ALL';
  componentsScanId: number = null;
  componentsScanApp = '';
  componentsScan: any = null;

  onViewComponents(rowItem: any) {
    this.componentsScanId = rowItem.id;
    this.componentsScanApp = rowItem.applicationName;
    this.componentsScan = rowItem;
    this.componentsGroupId = '';
    this.componentsArtifactId = '';
    this.componentsPasteInput = '';
    this.componentsVersionFilter = 'ALL';
    this.showComponentsDialog = true;
    this.fetchComponents();
  }

  /**
   * 解析粘贴的 Maven XML 或 Gradle dependency 格式，提取 groupId 和 artifactId
   */
  onParseDependency() {
    const input = this.componentsPasteInput || '';
    // Maven XML: <groupId>xxx</groupId> <artifactId>xxx</artifactId>
    const groupIdMatch = input.match(/<groupId>\s*([^<]+)\s*<\/groupId>/);
    const artifactIdMatch = input.match(/<artifactId>\s*([^<]+)\s*<\/artifactId>/);
    if (groupIdMatch && artifactIdMatch) {
      this.componentsGroupId = groupIdMatch[1].trim();
      this.componentsArtifactId = artifactIdMatch[1].trim();
      this.onComponentsSearch();
      return;
    }
    // Gradle: group: 'xxx', name: 'xxx'
    const gradleGroupMatch = input.match(/group:\s*['"]([^'"]+)['"]/);
    const gradleNameMatch = input.match(/name:\s*['"]([^'"]+)['"]/);
    if (gradleGroupMatch && gradleNameMatch) {
      this.componentsGroupId = gradleGroupMatch[1].trim();
      this.componentsArtifactId = gradleNameMatch[1].trim();
      this.onComponentsSearch();
      return;
    }
    // Gradle short: 'group:artifact:version'
    const shortMatch = input.match(/['"]([^'"]+):([^'"]+):([^'"]+)['"]/);
    if (shortMatch) {
      this.componentsGroupId = shortMatch[1].trim();
      this.componentsArtifactId = shortMatch[2].trim();
      this.onComponentsSearch();
      return;
    }
  }

  onComponentsSearch() {
    this.filterComponents();
  }

  // ==================== 反向依赖查询（哪些应用在用某组件） ====================
  showUsageDialog = false;
  usageLoading = false;
  usageGroupId = '';
  usageArtifactId = '';
  usageVersion = '';
  usagePasteInput = '';
  usageList: any[] = [];
  usageSearched = false;

  openUsageDialog() {
    this.usageGroupId = '';
    this.usageArtifactId = '';
    this.usageVersion = '';
    this.usagePasteInput = '';
    this.usageList = [];
    this.usageSearched = false;
    this.showUsageDialog = true;
    // 恢复上次查询条件（仅回填输入，结果重新查询以保证时效）
    const restored = this.loadUsageState();
    if (restored) {
      this.usageGroupId = restored.groupId || '';
      this.usageArtifactId = restored.artifactId || '';
      this.usageVersion = restored.version || '';
      if (this.usageGroupId && this.usageArtifactId) {
        this.queryUsage();
      }
    }
  }

  private static readonly USAGE_STORAGE_KEY = 'sca_component_usage_query';

  private loadUsageState(): { groupId: string; artifactId: string; version: string } | null {
    try {
      const raw = localStorage.getItem(ScaComponent.USAGE_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const obj = JSON.parse(raw);
      if (!obj || typeof obj.groupId !== 'string') {
        return null;
      }
      return { groupId: obj.groupId, artifactId: obj.artifactId || '', version: obj.version || '' };
    } catch (e) {
      return null;
    }
  }

  private saveUsageState() {
    try {
      localStorage.setItem(ScaComponent.USAGE_STORAGE_KEY, JSON.stringify({
        groupId: (this.usageGroupId || '').trim(),
        artifactId: (this.usageArtifactId || '').trim(),
        version: (this.usageVersion || '').trim(),
      }));
    } catch (e) {}
  }

  closeUsageDialog() {
    this.showUsageDialog = false;
  }

  // ==================== 汇总报表 ====================
  showReportDialog = false;
  reportLoading = false;
  report: any = null;

  openReportDialog() {
    this.showReportDialog = true;
    this.loadReport();
  }

  closeReportDialog() {
    this.showReportDialog = false;
  }

  /** 风险分布柱状图的最大值（用于柱宽百分比归一化，至少为1避免除0） */
  get riskMax(): number {
    const rd = this.report?.riskDistribution;
    if (!rd) {
      return 1;
    }
    return Math.max(1, rd.critical || 0, rd.high || 0, rd.medium || 0, rd.low || 0);
  }

  loadReport() {
    this.reportLoading = true;
    this.apiService.post('/sca', '/report/query', {}).subscribe({
      next: ({ body }: any) => {
        this.report = body || null;
        this.reportLoading = false;
      },
      error: () => {
        this.report = null;
        this.reportLoading = false;
      },
    });
  }

  /** 导出报表为 Markdown 文件 */
  onExportReport() {
    const r = this.report;
    if (!r) {
      return;
    }
    const escape = (v: any) => String(v ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
    const s = r.summary || {};
    const rd = r.riskDistribution || {};
    const lines: string[] = [];
    lines.push('# SCA 汇总报表');
    lines.push('');
    lines.push(`- **导出时间**: ${new Date().toLocaleString()}`);
    lines.push('- **口径**: 每个应用取最近一次扫描');
    lines.push('');
    lines.push('## 总览');
    lines.push('');
    lines.push('| 指标 | 值 |');
    lines.push('| --- | --- |');
    lines.push(`| 应用总数 | ${s.applicationCount ?? 0} |`);
    lines.push(`| 最近扫描成功 | ${s.successCount ?? 0} |`);
    lines.push(`| 最近扫描失败 | ${s.failedCount ?? 0} |`);
    lines.push(`| 平均扫描时长 | ${this.humanizeDuration(s.avgScanDuration) || '—'} |`);
    lines.push(`| 含漏洞应用 | ${s.vulnerableAppCount ?? 0} |`);
    lines.push(`| 组件总量 | ${s.totalComponents ?? 0} |`);
    lines.push(`| 漏洞组件总量 | ${s.totalVulnerableComponents ?? 0} |`);
    lines.push(`| 代码总行数 | ${s.totalCodeLines ?? 0} |`);
    lines.push('');
    lines.push('## 风险等级分布（漏洞组件）');
    lines.push('');
    lines.push('| 等级 | 数量 |');
    lines.push('| --- | --- |');
    lines.push(`| CRITICAL | ${rd.critical ?? 0} |`);
    lines.push(`| HIGH | ${rd.high ?? 0} |`);
    lines.push(`| MEDIUM | ${rd.medium ?? 0} |`);
    lines.push(`| LOW | ${rd.low ?? 0} |`);
    lines.push('');
    lines.push('## 漏洞 TOP 组件（按命中应用数）');
    lines.push('');
    lines.push('| # | Group ID | Artifact ID | 最高风险 | 命中应用数 |');
    lines.push('| --- | --- | --- | --- | --- |');
    (r.topVulnerableComponents || []).forEach((c: any, i: number) => {
      lines.push(`| ${i + 1} | ${escape(c.groupId)} | ${escape(c.artifactId)} | ${escape(c.maxRiskLevel)} | ${c.appCount ?? 0} |`);
    });
    lines.push('');
    lines.push('## 应用明细（每应用最近一次扫描）');
    lines.push('');
    lines.push('| # | 应用 | 分支 | 状态 | 组件数 | 漏洞数 | 扫描时间 |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- |');
    (r.applications || []).forEach((a: any, i: number) => {
      const t = a.scanTime ? new Date(a.scanTime).toLocaleString() : '';
      lines.push(`| ${i + 1} | ${escape(a.applicationName)} | ${escape(a.branch)} | ${escape(a.scanStatus)} | ${a.componentCount ?? 0} | ${a.riskCount ?? 0} | ${escape(t)} |`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sca-report-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /** 解析粘贴的 Maven XML / Gradle 依赖，提取 groupId / artifactId / version */
  onParseUsageDependency() {
    const input = this.usagePasteInput || '';
    // Maven XML
    const g = input.match(/<groupId>\s*([^<]+)\s*<\/groupId>/);
    const a = input.match(/<artifactId>\s*([^<]+)\s*<\/artifactId>/);
    const v = input.match(/<version>\s*([^<]+)\s*<\/version>/);
    if (g && a) {
      this.usageGroupId = g[1].trim();
      this.usageArtifactId = a[1].trim();
      this.usageVersion = v ? v[1].trim() : '';
      this.queryUsage();
      return;
    }
    // Gradle 长式: group: 'x', name: 'y', version: 'z'
    const gg = input.match(/group:\s*['"]([^'"]+)['"]/);
    const gn = input.match(/name:\s*['"]([^'"]+)['"]/);
    const gv = input.match(/version:\s*['"]([^'"]+)['"]/);
    if (gg && gn) {
      this.usageGroupId = gg[1].trim();
      this.usageArtifactId = gn[1].trim();
      this.usageVersion = gv ? gv[1].trim() : '';
      this.queryUsage();
      return;
    }
    // Gradle 短式: 'group:artifact:version'
    const short = input.match(/['"]?([\w.\-]+):([\w.\-]+):([\w.\-]+)['"]?/);
    if (short) {
      this.usageGroupId = short[1].trim();
      this.usageArtifactId = short[2].trim();
      this.usageVersion = short[3].trim();
      this.queryUsage();
      return;
    }
  }

  queryUsage() {
    const groupId = (this.usageGroupId || '').trim();
    const artifactId = (this.usageArtifactId || '').trim();
    if (!groupId || !artifactId) {
      return;
    }
    this.usageLoading = true;
    this.usageSearched = true;
    this.saveUsageState();
    this.apiService.post('/sca', '/component/usage/query', {
      groupId,
      artifactId,
      version: (this.usageVersion || '').trim() || null,
    }).subscribe({
      next: ({ body }: any) => {
        this.usageList = body || [];
        this.usageLoading = false;
      },
      error: () => {
        this.usageList = [];
        this.usageLoading = false;
      },
    });
  }

  /** 导出反查结果为 Markdown 表格文件 */
  onExportUsage() {
    const list = this.usageList || [];
    if (!list.length) {
      return;
    }
    const gav = [this.usageGroupId, this.usageArtifactId, this.usageVersion]
      .filter(Boolean).join(':');
    const escape = (v: any) => String(v ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
    const lines: string[] = [];
    lines.push(`# 组件反查应用 — ${gav}`);
    lines.push('');
    lines.push(`- **组件**: ${gav}`);
    lines.push(`- **使用应用数**: ${list.length}`);
    lines.push(`- **导出时间**: ${new Date().toLocaleString()}`);
    lines.push('- **说明**: 每个应用取最近一次扫描结果');
    lines.push('');
    lines.push('| # | 应用 | 使用版本 | Scope | 风险 | 最近扫描时间 |');
    lines.push('| --- | --- | --- | --- | --- | --- |');
    list.forEach((u, i) => {
      const risk = u.vulnerability ? (u.riskLevel || 'RISK') : 'OK';
      const t = u.scanTime ? new Date(u.scanTime).toLocaleString() : '';
      lines.push(`| ${i + 1} | ${escape(u.applicationName)} | ${escape(u.version)} | ${escape(u.scope)} | ${risk} | ${escape(t)} |`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safe = (this.usageArtifactId || 'component').replace(/[^\w.-]+/g, '_');
    a.download = `usage-${safe}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * 导出当前筛选后的组件为 Markdown 表格文件
   */
  onExportComponents() {
    const list = this.componentsList || [];
    if (!list.length) {
      return;
    }
    const escape = (v: any) => String(v ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
    const lines: string[] = [];
    lines.push(`# Components — ${this.componentsScanApp} (${this.componentsVersionFilter})`);
    lines.push('');
    lines.push(...this.buildScanMetaLines());
    lines.push(`- **Total**: ${list.length}`);
    lines.push('');
    lines.push('| # | Group ID | Artifact ID | Version | Scope | Risk | Vulnerabilities |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- |');
    list.forEach((c, i) => {
      const vulns = (c.vulnerabilities || []).map((v: any) => v.id).join(' ');
      lines.push(`| ${i + 1} | ${escape(c.groupId)} | ${escape(c.artifactId)} | ${escape(c.version)} | ${escape(c.scope)} | ${escape(c.vulnerability ? (c.riskLevel || 'UNKNOWN') : '')} | ${escape(vulns)} |`);
    });
    this.downloadMarkdown(lines.join('\n'), `components-${this.componentsVersionFilter}`);
  }

  /**
   * 导出有漏洞的组件(含 CVE 明细)为 Markdown
   */
  onExportVulnerableComponents() {
    const list = (this.allComponents || []).filter(c => c.vulnerability);
    if (!list.length) {
      return;
    }
    const escape = (v: any) => String(v ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
    const lines: string[] = [];
    lines.push(`# Vulnerable Components — ${this.componentsScanApp}`);
    lines.push('');
    lines.push(...this.buildScanMetaLines());
    lines.push(`- **Total vulnerable**: ${list.length}`);
    lines.push('');
    lines.push('| # | Group ID | Artifact ID | Version | Risk | Vulnerability | Severity | CVSS | Fixed Version | Reference |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    let idx = 1;
    list.forEach((c) => {
      const vulns = c.vulnerabilities || [];
      if (!vulns.length) {
        lines.push(`| ${idx++} | ${escape(c.groupId)} | ${escape(c.artifactId)} | ${escape(c.version)} | ${escape(c.riskLevel || 'UNKNOWN')} | | | | | |`);
        return;
      }
      vulns.forEach((v: any) => {
        lines.push(`| ${idx++} | ${escape(c.groupId)} | ${escape(c.artifactId)} | ${escape(c.version)} | ${escape(c.riskLevel || 'UNKNOWN')} | ${escape(v.id)} | ${escape(v.severity)} | ${escape(v.cvssScore)} | ${escape(v.fixedVersion)} | ${escape(v.referenceUrl)} |`);
      });
    });
    this.downloadMarkdown(lines.join('\n'), 'vulnerable-components');
  }

  /**
   * 构造 Markdown 头部的扫描元信息(git地址/分支/commit/扫描时间/操作人)
   */
  private buildScanMetaLines(): string[] {
    const s = this.componentsScan || {};
    const lines: string[] = [];
    lines.push(`- **Application**: ${s.applicationName || this.componentsScanApp || '-'}`);
    if (s.scanNo) {
      lines.push(`- **Scan No**: ${s.scanNo}`);
    }
    lines.push(`- **Git URL**: ${s.gitUrl || '-'}`);
    lines.push(`- **Branch**: ${s.branch || '-'}`);
    lines.push(`- **Commit**: ${s.commitId || '-'}`);
    lines.push(`- **Scan Time**: ${s.createTime ? new Date(s.createTime).toLocaleString() : '-'}`);
    lines.push(`- **Operator**: ${s.username || '-'}`);
    if (s.scanNo) {
      lines.push(`- **Link**: ${window.location.origin}/#/pages/security/sca?scanNo=${s.scanNo}`);
    }
    lines.push('');
    return lines;
  }

  private downloadMarkdown(markdown: string, suffix: string) {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeApp = (this.componentsScanApp || 'components').replace(/[^\w.-]+/g, '_');
    a.download = `${safeApp}-${suffix}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  onVersionFilterChange(tab: any) {
    this.componentsVersionFilter = tab;
    this.filterComponents();
  }

  private fetchComponents() {
    this.componentsLoading = true;
    this.apiService.post('/sca', '/scan/components/query', {
      scanId: this.componentsScanId,
    }).subscribe(({ body }: any) => {
      this.allComponents = body || [];
      this.snapshotCount = this.allComponents.filter(c => (c.version || '').toUpperCase().includes('SNAPSHOT')).length;
      this.releaseCount = this.allComponents.length - this.snapshotCount;
      this.vulnerableCount = this.allComponents.filter(c => c.vulnerability).length;
      this.filterComponents();
      this.componentsLoading = false;
    }, () => {
      this.componentsLoading = false;
    });
  }

  // ===== 内部模块弹窗 =====
  onViewInternalModules(rowItem: any) {
    this.internalModulesScanApp = rowItem.applicationName;
    this.internalModulesList = [];
    this.showInternalModulesDialog = true;
    this.internalModulesLoading = true;
    this.apiService.post('/sca', '/scan/internal-module/query', {
      scanId: rowItem.id,
    }).subscribe(({ body }: any) => {
      this.internalModulesList = body || [];
      this.internalModulesLoading = false;
    }, () => {
      this.internalModulesLoading = false;
    });
  }

  private filterComponents() {
    const groupId = this.componentsGroupId.toLowerCase();
    const artifactId = this.componentsArtifactId.toLowerCase();
    this.componentsList = this.allComponents.filter(c => {
      if (groupId && !(c.groupId || '').toLowerCase().includes(groupId)) return false;
      if (artifactId && !(c.artifactId || '').toLowerCase().includes(artifactId)) return false;
      if (this.componentsVersionFilter === 'SNAPSHOT' && !(c.version || '').toUpperCase().includes('SNAPSHOT')) return false;
      if (this.componentsVersionFilter === 'RELEASE' && (c.version || '').toUpperCase().includes('SNAPSHOT')) return false;
      if (this.componentsVersionFilter === 'VULNERABLE' && !c.vulnerability) return false;
      return true;
    });
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
}
