import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { ApiService } from '../../../@core/services/api.service';
import { ToastUtil } from '../../../@shared/utils/toast.util';
import { TerminalThemeService } from '../web-terminal/web-terminal-management/terminal-theme.service';
import { RELATIVE_TIME_LIMIT } from '../../../@shared/constant/date.constant';

/**
 * apollo-portal 镜像打包(专项, 固定应用 pp-apollo-portal)
 * 触发 Jenkins job job_build_pp-apollo-portal, 轮询回填状态, xterm 流式查看构建日志。
 */
@Component({
  selector: 'app-apollo-portal-image-build',
  templateUrl: './apollo-portal-image-build.component.html',
  styleUrls: ['./apollo-portal-image-build.component.less'],
})
export class ApolloPortalImageBuildComponent implements OnInit, OnDestroy {

  private static readonly BRANCH_KEY = 'apollo_portal_image_build_branch';

  // 触发表单
  branch = 'master';
  triggering = false;

  // 查询卡片(按分支解析最新 commit)
  config: any = null;
  configLoading = false;

  // 打包历史(分页)
  buildHistory: any[] = [];
  buildTotal = 0;
  buildPageIndex = 1;
  buildPageSize = 10;
  buildQueryName = '';
  buildLoading = false;
  autoRefresh = true;
  private refreshTimer: any = null;
  protected readonly limit = RELATIVE_TIME_LIMIT;

  constructor(
    private apiService: ApiService,
    private toastUtil: ToastUtil,
    private terminalThemeService: TerminalThemeService,
  ) {}

  ngOnInit(): void {
    const savedBranch = localStorage.getItem(ApolloPortalImageBuildComponent.BRANCH_KEY);
    if (savedBranch) {
      this.branch = savedBranch;
    }
    this.queryBuildHistory();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
    this.stopLogPolling();
    this.disposeTerminal();
    if (this.deployLogXterm) {
      this.deployLogXterm.dispose();
      this.deployLogXterm = null;
    }
  }

  get currentUsername(): string {
    return localStorage.getItem('username') || '';
  }

  // ===== 触发打包 =====
  onBranchBlur() {
    this.branch = (this.branch || '').trim() || 'master';
    localStorage.setItem(ApolloPortalImageBuildComponent.BRANCH_KEY, this.branch);
  }

  /** 按分支查询打包卡片(解析仓库最新 commit) */
  onQueryConfig() {
    const branch = (this.branch || '').trim() || 'master';
    this.branch = branch;
    this.configLoading = true;
    this.config = null;
    localStorage.setItem(ApolloPortalImageBuildComponent.BRANCH_KEY, branch);
    this.apiService.post('/application', '/apollo-portal/image/pack/config/query', {
      branch,
    }).subscribe(({ body }: any) => {
      this.config = body || null;
      this.configLoading = false;
    }, () => {
      this.configLoading = false;
    });
  }

  onTrigger() {
    if (this.triggering || !this.config) {
      return;
    }
    this.triggering = true;
    this.apiService.post('/application', '/apollo-portal/image/pack/trigger', {
      branch: this.config.branch,
      commitId: this.config.commitId || '',
    }).subscribe(() => {
      this.triggering = false;
      this.toastUtil.onSuccessToast('打包已触发');
      this.buildPageIndex = 1;
      this.queryBuildHistory();
    }, () => {
      this.triggering = false;
    });
  }

  /** 从历史行复用: 把该记录的分支填入并重新查询卡片 */
  onReuse(rowItem: any) {
    this.branch = (rowItem.branch || 'master').trim() || 'master';
    this.onQueryConfig();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {}
  }

  // ===== 打包历史(分页) =====
  queryBuildHistory(silent = false) {
    if (!silent) {
      this.buildLoading = true;
    }
    this.apiService.post('/application', '/apollo-portal/image/pack/page/query', {
      queryName: this.buildQueryName,
      page: this.buildPageIndex,
      length: this.buildPageSize,
    }).subscribe(({ body }: any) => {
      this.buildHistory = body?.data || [];
      this.buildTotal = body?.totalNum || 0;
      this.buildLoading = false;
    }, () => {
      this.buildLoading = false;
    });
  }

  onBuildSearch() {
    this.buildPageIndex = 1;
    this.queryBuildHistory();
  }

  onBuildPageIndexChange(pageIndex: number) {
    this.buildPageIndex = pageIndex;
    this.queryBuildHistory();
  }

  onBuildPageSizeChange(pageSize: number) {
    this.buildPageSize = pageSize;
    this.buildPageIndex = 1;
    this.queryBuildHistory();
  }

  onAutoRefreshChange(enabled: boolean) {
    if (enabled) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  private startAutoRefresh() {
    this.stopAutoRefresh();
    this.refreshTimer = setInterval(() => this.queryBuildHistory(true), 10000);
  }

  private stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /** 删除打包记录(仅非成功/非进行中, 后端也会二次校验) */
  onDelete(rowItem: any) {
    if (rowItem.buildStatus === 'SUCCESS') {
      return;
    }
    if (!confirm(`确认删除打包记录 ${rowItem.buildNo} ?`)) {
      return;
    }
    this.apiService.post('/application', '/apollo-portal/image/pack/delete', { id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast('已删除');
        this.queryBuildHistory();
      });
  }

  /** 镜像展示名: 用 {} 省略 registry host, 如 {}/library/apollo-portal:2.1.0-9 */
  shortImage(image: string): string {
    if (!image) {
      return '';
    }
    const idx = image.indexOf('/');
    return idx > 0 ? '{}/' + image.substring(idx + 1) : image;
  }

  statusLabelStyle(status: string): string {
    return status === 'SUCCESS' ? 'green-w98' : status === 'FAILED' ? 'red-w98' : 'blue-w98';
  }

  // ===== 发布(部署): 查询 group=apollo-portal 服务器, 按 CountryCode + Project 合并平铺 =====
  deployLoading = false;
  deployServers: any[] = [];
  deployGroups: any[] = [];
  deployTarget: any = null;

  onDeploy(rowItem: any) {
    this.deployTarget = rowItem;
    this.deployLoading = true;
    this.deployServers = [];
    this.deployGroups = [];
    this.apiService.post('/application', '/apollo-portal/deploy/server/page/query', {
      queryName: '',
      page: 1,
      length: 100,
    }).subscribe(({ body }: any) => {
      this.deployServers = body?.data || [];
      this.buildDeployGroups();
      this.loadDeployVersions();
      this.deployLoading = false;
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {}
    }, () => {
      this.deployLoading = false;
    });
  }

  /** 读取服务器的业务标签值(按 tagKey) */
  private serverTagValue(server: any, key: string): string {
    const tags = server?.businessTags || [];
    const hit = tags.find((bt: any) => bt?.tag?.tagKey === key);
    return hit?.tagValue || '';
  }

  /** 按 CountryCode(必有) + Project(可选) 合并服务器 */
  private buildDeployGroups() {
    const map = new Map<string, any>();
    for (const s of this.deployServers) {
      const countryCode = this.serverTagValue(s, 'CountryCode') || '未分类';
      const project = this.serverTagValue(s, 'Project') || '';
      const key = countryCode + '||' + project;
      if (!map.has(key)) {
        map.set(key, { countryCode, project, servers: [] });
      }
      map.get(key).servers.push(s);
    }
    this.deployGroups = Array.from(map.values())
      .sort((a, b) => (a.countryCode + '|' + a.project).localeCompare(b.countryCode + '|' + b.project));
    // CountryCode 去重(用于 Tab 切换)
    this.deployCountries = Array.from(new Set(this.deployGroups.map((g) => g.countryCode)))
      .sort((a, b) => a.localeCompare(b));
    if (!this.deployCountries.includes(this.selectedCountry)) {
      this.selectedCountry = this.deployCountries.length ? this.deployCountries[0] : '';
    }
  }

  // CountryCode Tab
  deployCountries: string[] = [];
  selectedCountry = '';

  onCountryChange(cc: string) {
    this.selectedCountry = cc;
  }

  /** 指定 CountryCode 下的分组(按 Project) */
  groupsOfCountry(cc: string): any[] {
    return this.deployGroups.filter((g) => g.countryCode === cc);
  }

  countryServerCount(cc: string): number {
    return this.groupsOfCountry(cc)
      .reduce((sum, g) => sum + (g.servers?.length || 0), 0);
  }

  // 单机部署状态/结果: assetId -> 值
  deployingAsset: { [id: number]: boolean } = {};
  deployResultMap: { [id: number]: any } = {};

  private deployImageLabel(): string {
    if (!this.deployTarget) {
      return '';
    }
    return this.deployTarget.imageTag || this.shortImage(this.deployTarget.image);
  }

  // 部署确认弹框
  showDeployConfirm = false;
  confirmServer: any = null;

  onServerDeploy(server: any) {
    if (!this.deployTarget?.image) {
      return;
    }
    if (this.deployingAsset[server.id]) {
      return;
    }
    this.confirmServer = server;
    this.showDeployConfirm = true;
  }

  closeDeployConfirm() {
    this.showDeployConfirm = false;
    this.confirmServer = null;
  }

  /** 当前版本(用于确认弹框展示) */
  currentVersion(server: any): string {
    const d = server && this.deployVersionMap[server.name];
    return (d && (d.currentTag || d.currentImage)) || '未知';
  }

  /** 当前版本 == 发布版本(完整镜像相同)时禁用部署 */
  isSameVersion(server: any): boolean {
    const d = server && this.deployVersionMap[server.name];
    if (!d || !d.currentImage || !this.deployTarget?.image) {
      return false;
    }
    return d.currentImage === this.deployTarget.image;
  }

  confirmDeploy() {
    const server = this.confirmServer;
    this.showDeployConfirm = false;
    this.confirmServer = null;
    if (server) {
      this.doServerDeploy(server);
    }
  }

  private doServerDeploy(server: any) {
    this.deployingAsset[server.id] = true;
    this.apiService.post('/application', '/apollo-portal/deploy/server/deploy', {
      assetId: server.id,
      image: this.deployTarget.image,
    }).subscribe(({ body }: any) => {
      this.deployingAsset[server.id] = false;
      this.deployResultMap[server.id] = body;
      if (body?.success) {
        this.toastUtil.onSuccessToast(`${server.name} 部署成功`);
      }
      this.loadDeployVersions();
      this.onViewDeployLog(server);
    }, () => {
      this.deployingAsset[server.id] = false;
    });
  }

  // ===== 当前版本(部署记录) =====
  deployVersionMap: { [host: string]: any } = {};

  private loadDeployVersions() {
    this.apiService.post('/application', '/apollo-portal/deploy/page/query', {
      queryName: '',
      page: 1,
      length: 200,
    }).subscribe(({ body }: any) => {
      const map: any = {};
      (body?.data || []).forEach((d: any) => {
        map[d.hostName] = d;
      });
      this.deployVersionMap = map;
    });
  }

  // ===== 部署日志(xterm 弹窗, 静态输出) =====
  showDeployLog = false;
  deployLogTitle = '';
  @ViewChild('deployLogTerm') private deployLogTermRef: ElementRef;
  private deployLogXterm: Terminal;
  private deployLogFit: FitAddon;
  private pendingDeployLog = '';

  onViewDeployLog(server: any) {
    const res = this.deployResultMap[server.id];
    if (!res) {
      return;
    }
    this.deployLogTitle = server.name;
    this.pendingDeployLog = res.output || '(无输出)';
    this.showDeployLog = true;
    setTimeout(() => {
      this.initDeployLogTerminal();
      if (this.deployLogXterm) {
        this.deployLogXterm.clear();
        this.deployLogXterm.write(this.pendingDeployLog);
      }
    }, 50);
  }

  private initDeployLogTerminal() {
    if (this.deployLogXterm || !this.deployLogTermRef) {
      return;
    }
    const t = this.terminalThemeService.getCurrentTheme();
    const c = t.colors;
    this.deployLogXterm = new Terminal({
      fontFamily: t.fontFamily || '"SFMono-Regular", Consolas, "Courier New", monospace',
      fontSize: t.fontSize || 12,
      lineHeight: t.lineHeight || 1.2,
      cursorBlink: false,
      disableStdin: true,
      convertEol: true,
      scrollback: 100000,
      theme: {
        foreground: c.foreground,
        background: c.background,
        cursor: c.cursor,
        black: c.black,
        red: c.red,
        green: c.green,
        yellow: c.yellow,
        blue: c.blue,
        magenta: c.magenta,
        cyan: c.cyan,
        white: c.white,
        brightBlack: c.brightBlack,
        brightRed: c.brightRed,
        brightGreen: c.brightGreen,
        brightYellow: c.brightYellow,
        brightBlue: c.brightBlue,
        brightMagenta: c.brightMagenta,
        brightCyan: c.brightCyan,
        brightWhite: c.brightWhite,
      },
    });
    this.deployLogFit = new FitAddon();
    this.deployLogXterm.loadAddon(this.deployLogFit);
    this.deployLogXterm.loadAddon(new WebLinksAddon());
    this.deployLogXterm.open(this.deployLogTermRef.nativeElement);
    this.safeDeployFit();
    setTimeout(() => this.safeDeployFit(), 60);
    setTimeout(() => this.safeDeployFit(), 250);
  }

  private safeDeployFit() {
    try {
      this.deployLogFit?.fit();
    } catch (e) {}
  }

  closeDeployLog() {
    this.showDeployLog = false;
    if (this.deployLogXterm) {
      this.deployLogXterm.dispose();
      this.deployLogXterm = null;
    }
    this.deployLogFit = null;
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

  /** Jenkins 构建地址: https://<instanceName>/job/<jobName>/<buildId>/ */
  getBuildUrl(rowItem: any): string {
    if (rowItem?.instanceName && rowItem?.jobName && rowItem?.buildId) {
      return `https://${rowItem.instanceName}/job/${rowItem.jobName}/${rowItem.buildId}/`;
    }
    return '';
  }

  buildLink(rowItem: any): string {
    const url = rowItem?.buildUrl || this.getBuildUrl(rowItem);
    return /^https?:\/\//.test(url || '') ? url : '';
  }

  // ===== 构建日志(流式/增量, xterm.js 渲染) =====
  showLogDialog = false;
  logScan: any = null;
  logLoading = false;
  @ViewChild('logTerm') private logTermRef: ElementRef;
  private xterm: Terminal;
  private fitAddon: FitAddon;
  private logResizeObserver: any = null;
  private logNextStart = 0;
  private logTimer: any = null;
  private logRaw = '';
  private logWritten = 0;

  onViewLog(rowItem: any) {
    this.stopLogPolling();
    this.disposeTerminal();
    this.logScan = rowItem;
    this.logNextStart = 0;
    this.logRaw = '';
    this.logWritten = 0;
    this.showLogDialog = true;
    this.logLoading = true;
    setTimeout(() => {
      this.initTerminal();
      this.pollLog();
    }, 50);
  }

  private initTerminal() {
    if (this.xterm || !this.logTermRef) {
      return;
    }
    const t = this.terminalThemeService.getCurrentTheme();
    const c = t.colors;
    this.xterm = new Terminal({
      fontFamily: t.fontFamily || '"SFMono-Regular", Consolas, "Courier New", monospace',
      fontSize: t.fontSize || 12,
      lineHeight: t.lineHeight || 1.2,
      cursorBlink: false,
      disableStdin: true,
      convertEol: true,
      scrollback: 100000,
      theme: {
        foreground: c.foreground,
        background: c.background,
        cursor: c.cursor,
        black: c.black,
        red: c.red,
        green: c.green,
        yellow: c.yellow,
        blue: c.blue,
        magenta: c.magenta,
        cyan: c.cyan,
        white: c.white,
        brightBlack: c.brightBlack,
        brightRed: c.brightRed,
        brightGreen: c.brightGreen,
        brightYellow: c.brightYellow,
        brightBlue: c.brightBlue,
        brightMagenta: c.brightMagenta,
        brightCyan: c.brightCyan,
        brightWhite: c.brightWhite,
      },
    });
    this.fitAddon = new FitAddon();
    this.xterm.loadAddon(this.fitAddon);
    this.xterm.loadAddon(new WebLinksAddon());
    this.xterm.open(this.logTermRef.nativeElement);
    this.safeFit();
    setTimeout(() => this.safeFit(), 60);
    setTimeout(() => this.safeFit(), 250);
    if ((window as any).ResizeObserver) {
      this.logResizeObserver = new (window as any).ResizeObserver(() => this.safeFit());
      this.logResizeObserver.observe(this.logTermRef.nativeElement);
    }
  }

  private safeFit() {
    try {
      this.fitAddon?.fit();
    } catch (e) {}
  }

  get logTermBg(): string {
    return this.terminalThemeService.getCurrentTheme()?.colors?.background || '#1e1e1e';
  }

  private pollLog() {
    if (!this.showLogDialog || !this.logScan) {
      return;
    }
    this.apiService.post('/application', '/apollo-portal/image/pack/log/query', {
      buildNo: this.logScan.buildNo,
      start: this.logNextStart,
    }).subscribe(({ body }: any) => {
      this.logLoading = false;
      if (!body || !this.showLogDialog) {
        return;
      }
      if (body.log) {
        this.logRaw += body.log;
        this.flushLog();
      }
      if (body.nextStart != null) {
        this.logNextStart = body.nextStart;
      }
      if (body.hasMore) {
        this.logTimer = setTimeout(() => this.pollLog(), 1500);
      }
    }, () => {
      this.logLoading = false;
    });
  }

  private flushLog() {
    if (!this.xterm) {
      return;
    }
    const esc = '\u001b';
    const pending = this.logRaw.slice(this.logWritten);
    if (!pending) {
      return;
    }
    let safe = pending.length;
    const lastOpen = pending.lastIndexOf(esc + '[8m');
    const lastClose = pending.lastIndexOf(esc + '[0m');
    if (lastOpen !== -1 && lastOpen > lastClose) {
      safe = Math.min(safe, lastOpen);
    }
    const dangling = pending.slice(0, safe)
      .search(/\u001b(\[[0-9;]*)?$/);
    if (dangling !== -1) {
      safe = dangling;
    }
    if (safe <= 0) {
      return;
    }
    const chunk = pending.slice(0, safe)
      .replace(/\u001b\[8m[\s\S]*?\u001b\[0m/g, '');
    if (chunk) {
      this.xterm.write(chunk);
    }
    this.logWritten += safe;
  }

  closeLogDialog() {
    this.showLogDialog = false;
    this.stopLogPolling();
    this.disposeTerminal();
  }

  private stopLogPolling() {
    if (this.logTimer) {
      clearTimeout(this.logTimer);
      this.logTimer = null;
    }
  }

  private disposeTerminal() {
    if (this.logResizeObserver) {
      this.logResizeObserver.disconnect();
      this.logResizeObserver = null;
    }
    if (this.xterm) {
      this.xterm.dispose();
      this.xterm = null;
    }
    this.fitAddon = null;
  }

}
