import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../@core/services/api.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { map } from 'rxjs/operators';
import { RELATIVE_TIME_LIMIT } from '../../../@shared/constant/date.constant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sca',
  templateUrl: './sca.component.html',
  styleUrls: ['./sca.component.less'],
})
export class ScaComponent implements OnInit, OnDestroy {

  private static readonly STORAGE_KEY = 'sca_selected_application';

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

  onQuery() {
    if (!this.selectedApplication?.name) {
      return;
    }
    this.loading = true;
    this.result = null;
    this.apiService.post('/sca', '/application/config/query', {
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
    this.apiService.post('/sca', '/application/scan', {
      applicationName: this.selectedApplication.name,
      branch: this.branch || 'master',
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
