import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { ApiService } from '../../../@core/services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastUtil } from '../../../@shared/utils/toast.util';
import { TerminalThemeService } from '../web-terminal/web-terminal-management/terminal-theme.service';
import { TranslateService } from '@ngx-translate/core';
import { RELATIVE_TIME_LIMIT } from '../../../@shared/constant/date.constant';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../@shared/utils/dialog.util';
import { EdsAssetSshTerminalComponent } from '../../ext-datasource/eds-instance/eds-asset/eds-asset-data-table/eds-asset-ssh-terminal/eds-asset-ssh-terminal.component';

/**
 * 通用应用持续交付(打包 + 部署), 配置驱动。
 * 顶部选应用(来自 /app-release/config/query) → 查询该应用可打包的构建(多仓库) → 选仓库打包 → 部署到 Group 服务器。
 */
@Component({
  selector: 'app-app-continuous-delivery',
  templateUrl: './app-continuous-delivery.component.html',
  styleUrls: ['./app-continuous-delivery.component.less'],
})
export class AppContinuousDeliveryComponent implements OnInit, OnDestroy {

  private static readonly APP_KEY = 'acd_selected_app';
  private static readonly BRANCH_KEY = 'acd_branch_by_app';

  configs: any[] = [];
  selectedApp = '';
  branch = 'master';

  /** 应用名列表(供下拉, 字符串数组更稳) */
  get appNames(): string[] {
    return (this.configs || []).map((c) => c.applicationName);
  }

  // 查询结果(builds)
  result: any = null;
  configLoading = false;
  triggeringProject: string = null;

  // 打包历史
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
    private translate: TranslateService,
    private dialogUtil: DialogUtil,
  ) {}

  /** 打开服务器终端(弹窗, 复用 EDS 资产 SSH 终端组件) */
  onServerTerminal(server: any) {
    // 终端弹窗宽=页面 80%, 高=页面 80%(固定像素, 之后缩放浏览器不改变), 参考 eds/asset 终端实现
    const w = Math.round(window.innerWidth * 0.8);
    const h = Math.round(window.innerHeight * 0.8);
    const dialogDate = {
      ...DIALOG_DATA.editorData,
      width: w + 'px',
      height: h + 'px',
      maxHeight: h + 'px',
      content: EdsAssetSshTerminalComponent,
      title: 'Asset Login',
    };
    // 终端 section 高度 = 弹窗高 - 标题/内边距(约 96px), 让终端撑满
    const formData: any = { ...server, __dialogHeight: Math.max(300, h - 96) + 'px' };
    this.dialogUtil.onEditWithoutButtonDialog(UPDATE_OPERATION, dialogDate, () => null, formData);
  }

  ngOnInit(): void {
    this.apiService.post('/application', '/app-release/config/query', {}).subscribe(({ body }: any) => {
      this.configs = body || [];
      const saved = localStorage.getItem(AppContinuousDeliveryComponent.APP_KEY);
      if (saved && this.configs.some((c: any) => c.applicationName === saved)) {
        this.selectedApp = saved;
      } else if (this.configs.length) {
        this.selectedApp = this.configs[0].applicationName;
      }
      this.branch = this.loadBranch(this.selectedApp) || 'master';
      this.queryBuildHistory();
      this.startAutoRefresh();
    });
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

  private loadBranchMap(): { [app: string]: string } {
    try {
      return JSON.parse(localStorage.getItem(AppContinuousDeliveryComponent.BRANCH_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  private loadBranch(app: string): string {
    return app ? (this.loadBranchMap()[app] || '') : '';
  }

  onAppChange(app: string) {
    this.selectedApp = app;
    localStorage.setItem(AppContinuousDeliveryComponent.APP_KEY, app);
    this.branch = this.loadBranch(app) || 'master';
    this.result = null;
    this.buildPageIndex = 1;
    this.queryBuildHistory();
  }

  onBranchBlur() {
    this.branch = (this.branch || '').trim() || 'master';
    if (this.selectedApp) {
      const map = this.loadBranchMap();
      map[this.selectedApp] = this.branch;
      localStorage.setItem(AppContinuousDeliveryComponent.BRANCH_KEY, JSON.stringify(map));
    }
  }

  // ===== 选择 Project 弹窗（分支选择器，参考 SCA 页；分支选项复用 /sca 接口） =====
  showBuildPicker = false;
  buildPickerLoading = false;
  buildPickerList: any[] = [];
  selectedBuild: any = null;
  branchOptionsLoading = false;
  branchSelectOptions: any[] = [];
  selectedBranchOption: any = null;
  selectedBranch: string = null;

  /** 分支框 d-search 的搜索动作: 弹出 Project 选择 */
  onBranchSearch() {
    this.openBuildPicker();
  }

  /** 打开选择 project 弹窗: 用当前应用+分支查配置, 列出 builds(project + gitUrl) */
  openBuildPicker() {
    if (!this.selectedApp) {
      return;
    }
    this.onBranchBlur();
    this.showBuildPicker = true;
    this.buildPickerLoading = true;
    this.buildPickerList = [];
    this.selectedBuild = null;
    this.branchSelectOptions = [];
    this.selectedBranchOption = null;
    this.selectedBranch = null;
    this.apiService.post('/application', '/app-release/build/config/query', {
      applicationName: this.selectedApp,
      branch: (this.branch || '').trim() || 'master',
    }).subscribe(({ body }: any) => {
      this.buildPickerList = (body?.builds || []).map((b: any) => ({
        project: b.project || b.moduleName || '',
        gitUrl: b?.buildProject?.repository?.sshUrl || '',
        raw: b,
      }));
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

  /** 选中一个 project 后, 复用 /sca 接口查询该 build(gitUrl)的 GitLab 分支选项 */
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

  /** 弹窗内 d-select 选中变化: 派生分支名字符串 */
  onPickerBranchChange(opt: any) {
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

  /** 确认分支: 填回分支框(并走本页 per-app 持久化)并关闭弹窗 */
  confirmBranch() {
    if (this.selectedBranch) {
      this.branch = this.selectedBranch;
      this.onBranchBlur();
    }
    this.showBuildPicker = false;
  }

  // ===== 权限配置弹窗(当前应用的 build/deploy 授权) =====
  showAuthDialog = false;
  authLoading = false;
  authSaving = false;
  authList: any[] = [];
  newAuthUsername = '';
  newAuthUserOption: any = null;
  newAuthBuild = false;
  newAuthDeploy = false;

  /** d-select 搜索用户(参考 user/list 的 /user/page/query), 返回 devui {id, option} 包裹 */
  onSearchUser = (term: string) => {
    return this.apiService.post('/user', '/page/query', {
      queryName: (term || '').trim(),
      page: 1,
      length: 20,
    }).pipe(
      map(({ body }: any) => (body?.data || []).map((u: any, index: number) => ({
        id: index,
        option: { label: u.username, value: u.username, desc: u.displayName || u.name || u.email || '' },
      }))),
    );
  };

  /** 选中用户后填入待添加用户名 */
  onSelectAuthUser(opt: any) {
    this.newAuthUsername = opt ? opt.value : '';
  }

  openAuthDialog() {
    if (!this.selectedApp) {
      return;
    }
    this.showAuthDialog = true;
    this.newAuthUsername = '';
    this.newAuthUserOption = null;
    this.newAuthBuild = false;
    this.newAuthDeploy = false;
    this.loadAuths();
  }

  closeAuthDialog() {
    this.showAuthDialog = false;
  }

  loadAuths() {
    this.authLoading = true;
    this.authList = [];
    this.apiService.post('/application', '/app-release/auth/query', {
      applicationName: this.selectedApp,
    }).subscribe(({ body }: any) => {
      this.authList = body || [];
      this.authLoading = false;
    }, () => {
      this.authLoading = false;
    });
  }

  onAddAuth() {
    const username = (this.newAuthUsername || '').trim();
    if (!username) {
      return;
    }
    this.authSaving = true;
    this.apiService.post('/application', '/app-release/auth/save', {
      applicationName: this.selectedApp,
      username,
      buildPermission: this.newAuthBuild,
      deployPermission: this.newAuthDeploy,
      enabled: true,
    }).subscribe(() => {
      this.authSaving = false;
      this.newAuthUsername = '';
      this.newAuthUserOption = null;
      this.newAuthBuild = false;
      this.newAuthDeploy = false;
      this.loadAuths();
    }, () => {
      this.authSaving = false;
    });
  }

  /** 行内切换权限/启用后保存 */
  onSaveAuthRow(a: any) {
    this.apiService.post('/application', '/app-release/auth/save', {
      id: a.id,
      applicationName: this.selectedApp,
      username: a.username,
      buildPermission: !!a.buildPermission,
      deployPermission: !!a.deployPermission,
      enabled: !!a.enabled,
    }).subscribe(() => {}, () => {
      // 保存失败则刷新回真实状态
      this.loadAuths();
    });
  }

  onDeleteAuth(a: any) {
    if (!a?.id) {
      return;
    }
    this.apiService.post('/application', '/app-release/auth/delete', { id: a.id })
      .subscribe(() => this.loadAuths(), () => this.loadAuths());
  }

  // ===== 发布配置管理弹窗(pp_app_release_config, 当前选中应用) =====
  showConfigMgrDialog = false;
  configMgrLoading = false;
  configMgrSaving = false;
  editingConfig: any = null;
  isNewConfig = false;

  openConfigDialog() {
    if (!this.selectedApp) {
      return;
    }
    this.showConfigMgrDialog = true;
    this.editingConfig = null;
    this.isNewConfig = false;
    this.loadConfigForSelectedApp();
  }

  closeConfigDialog() {
    this.showConfigMgrDialog = false;
  }

  /** 直接加载当前选中应用的配置(存在则编辑, 不存在则新建预填 applicationName) */
  loadConfigForSelectedApp() {
    this.configMgrLoading = true;
    this.apiService.post('/application', '/app-release/config/query', {}).subscribe(({ body }: any) => {
      const list = body || [];
      const found = list.find((c: any) => c.applicationName === this.selectedApp);
      if (found) {
        this.isNewConfig = false;
        this.editingConfig = { ...found };
      } else {
        this.isNewConfig = true;
        this.editingConfig = {
          applicationName: this.selectedApp,
          serverGroup: '', jobName: '', composeFile: '', sudo: false,
          tagPrefix: '', imageName: '', imageRegistry: '', imageProject: '',
          enabled: true, comment: '',
        };
      }
      this.configMgrLoading = false;
    }, () => {
      this.configMgrLoading = false;
    });
  }

  onSaveConfig() {
    const cfg = this.editingConfig;
    if (!cfg || !cfg.applicationName?.trim()) {
      return;
    }
    this.configMgrSaving = true;
    this.apiService.post('/application', '/app-release/config/save', {
      id: this.isNewConfig ? null : cfg.id,
      applicationName: cfg.applicationName.trim(),
      serverGroup: cfg.serverGroup,
      jobName: cfg.jobName,
      composeFile: cfg.composeFile,
      sudo: !!cfg.sudo,
      tagPrefix: cfg.tagPrefix,
      imageName: cfg.imageName,
      imageRegistry: cfg.imageRegistry,
      imageProject: cfg.imageProject,
      enabled: cfg.enabled !== false,
      comment: cfg.comment,
    }).subscribe(({ body }: any) => {
      this.configMgrSaving = false;
      if (body) {
        this.isNewConfig = false;
        this.editingConfig = { ...body };
      }
      this.closeConfigDialog();
    }, () => {
      this.configMgrSaving = false;
    });
  }

  onDeleteConfig(c: any) {
    if (!c?.id) {
      return;
    }
    this.apiService.post('/application', '/app-release/config/delete', { id: c.id })
      .subscribe(() => this.closeConfigDialog(), () => this.closeConfigDialog());
  }

  onQueryConfig() {
    if (!this.selectedApp) {
      return;
    }
    this.onBranchBlur();
    this.configLoading = true;
    this.result = null;
    this.apiService.post('/application', '/app-release/build/config/query', {
      applicationName: this.selectedApp,
      branch: this.branch,
    }).subscribe(({ body }: any) => {
      this.result = body;
      this.configLoading = false;
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {}
    }, () => {
      this.configLoading = false;
    });
  }

  /** 触发某个 build(仓库)打包 */
  onTrigger(build: any) {
    if (this.triggeringProject) {
      return;
    }
    const commitId = build?.buildProject?.commit?.id || '';
    this.triggeringProject = build.project;
    this.apiService.post('/application', '/app-release/build/trigger', {
      applicationName: this.selectedApp,
      branch: this.branch,
      commitId,
      project: build.project,
    }).subscribe(() => {
      this.triggeringProject = null;
      this.toastUtil.onSuccessToast(this.translate.instant('appContinuousDelivery.toast.buildTriggered'));
      this.buildPageIndex = 1;
      this.queryBuildHistory();
    }, () => {
      this.triggeringProject = null;
    });
  }

  buildSshUrl(build: any): string {
    return build?.buildProject?.repository?.sshUrl || '';
  }

  // ===== 打包历史 =====
  queryBuildHistory(silent = false) {
    if (!this.selectedApp) {
      return;
    }
    if (!silent) {
      this.buildLoading = true;
    }
    this.apiService.post('/application', '/app-release/build/page/query', {
      applicationName: this.selectedApp,
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

  onDelete(rowItem: any) {
    if (rowItem.buildStatus === 'SUCCESS') {
      return;
    }
    if (!confirm(this.translate.instant('appContinuousDelivery.toast.deleteConfirm', { buildNo: rowItem.buildNo }))) {
      return;
    }
    this.apiService.post('/application', '/app-release/build/delete', { id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(this.translate.instant('appContinuousDelivery.toast.deleted'));
        this.queryBuildHistory();
      });
  }

  statusLabelStyle(status: string): string {
    return status === 'SUCCESS' ? 'green-w98' : status === 'FAILED' ? 'red-w98' : 'blue-w98';
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
      return `${h}h ${m}m`;
    }
    if (m > 0) {
      return `${m}m ${s}s`;
    }
    return `${s}s`;
  }

  shortImage(image: string): string {
    if (!image) {
      return '';
    }
    const idx = image.indexOf('/');
    return idx > 0 ? '{}/' + image.substring(idx + 1) : image;
  }

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

  // ===== 构建日志(xterm 流式) =====
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

  private buildXtermTheme(): any {
    const t = this.terminalThemeService.getCurrentTheme();
    const c = t.colors;
    return {
      term: new Terminal({
        fontFamily: t.fontFamily || '"SFMono-Regular", Consolas, "Courier New", monospace',
        fontSize: t.fontSize || 12,
        lineHeight: t.lineHeight || 1.2,
        cursorBlink: false,
        disableStdin: true,
        convertEol: true,
        scrollback: 100000,
        theme: {
          foreground: c.foreground, background: c.background, cursor: c.cursor,
          black: c.black, red: c.red, green: c.green, yellow: c.yellow, blue: c.blue,
          magenta: c.magenta, cyan: c.cyan, white: c.white,
          brightBlack: c.brightBlack, brightRed: c.brightRed, brightGreen: c.brightGreen,
          brightYellow: c.brightYellow, brightBlue: c.brightBlue, brightMagenta: c.brightMagenta,
          brightCyan: c.brightCyan, brightWhite: c.brightWhite,
        },
      }),
    };
  }

  private initTerminal() {
    if (this.xterm || !this.logTermRef) {
      return;
    }
    this.xterm = this.buildXtermTheme().term;
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
    this.apiService.post('/application', '/app-release/build/log/query', {
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

  // ===== 服务器/部署详情(内联复用部署服务器区, 不依赖选中构建) =====
  /** 搜索栏"部署详情"按钮: 内联展示当前所选应用的服务器信息(复用部署服务器区) */
  onViewServerInfo() {
    if (!this.selectedApp) {
      return;
    }
    // 只看详情, 不设部署目标(部署按钮因 deployTarget 为空而禁用)
    this.deployTarget = null;
    this.deployResultMap = {};
    this.deployLoading = true;
    this.deployServers = [];
    this.deployGroups = [];
    this.apiService.post('/application', '/app-release/deploy/server/page/query', {
      applicationName: this.selectedApp,
      queryName: '',
      page: 1,
      length: 200,
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

  // ===== 部署 =====
  deployLoading = false;
  deployServers: any[] = [];
  deployGroups: any[] = [];
  deployCountries: string[] = [];
  selectedCountry = '';
  deployTarget: any = null;
  deployVersionMap: { [host: string]: any } = {};
  deployingAsset: { [id: number]: boolean } = {};
  deployResultMap: { [id: number]: any } = {};

  onDeploy(rowItem: any) {
    this.deployTarget = rowItem;
    this.deployLoading = true;
    this.deployServers = [];
    this.deployGroups = [];
    this.apiService.post('/application', '/app-release/deploy/server/page/query', {
      applicationName: this.selectedApp,
      queryName: '',
      page: 1,
      length: 200,
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

  private serverTagValue(server: any, key: string): string {
    const tags = server?.businessTags || [];
    const hit = tags.find((bt: any) => bt?.tag?.tagKey === key);
    return hit?.tagValue || '';
  }

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
    this.deployCountries = Array.from(new Set(this.deployGroups.map((g) => g.countryCode)))
      .sort((a, b) => a.localeCompare(b));
    if (!this.deployCountries.includes(this.selectedCountry)) {
      this.selectedCountry = this.deployCountries.length ? this.deployCountries[0] : '';
    }
  }

  onCountryChange(cc: string) {
    this.selectedCountry = cc;
  }

  groupsOfCountry(cc: string): any[] {
    return this.deployGroups.filter((g) => g.countryCode === cc);
  }

  countryServerCount(cc: string): number {
    return this.groupsOfCountry(cc)
      .reduce((sum, g) => sum + (g.servers?.length || 0), 0);
  }

  countryFlagUrl(cc: string): string {
    if (!cc || !/^[A-Za-z]{2}$/.test(cc)) {
      return '';
    }
    return 'https://flagcdn.com/' + cc.toLowerCase() + '.svg';
  }

  private loadDeployVersions() {
    this.apiService.post('/application', '/app-release/deploy/query', {
      applicationName: this.selectedApp,
    }).subscribe(({ body }: any) => {
      const map: any = {};
      (body || []).forEach((d: any) => {
        map[d.hostName] = d;
      });
      this.deployVersionMap = map;
    });
  }

  currentVersion(server: any): string {
    const d = server && this.deployVersionMap[server.name];
    return (d && (d.currentTag || d.currentImage)) || this.translate.instant('appContinuousDelivery.servers.unknown');
  }

  isSameVersion(server: any): boolean {
    const d = server && this.deployVersionMap[server.name];
    if (!d || !d.currentImage || !this.deployTarget?.image) {
      return false;
    }
    return d.currentImage === this.deployTarget.image;
  }

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
    if (!this.deployTarget?.image || this.deployingAsset[server.id]) {
      return;
    }
    this.confirmServer = server;
    this.showDeployConfirm = true;
  }

  closeDeployConfirm() {
    this.showDeployConfirm = false;
    this.confirmServer = null;
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
    this.apiService.post('/application', '/app-release/deploy/server/deploy', {
      applicationName: this.selectedApp,
      assetId: server.id,
      image: this.deployTarget.image,
    }).subscribe(({ body }: any) => {
      this.deployingAsset[server.id] = false;
      this.deployResultMap[server.id] = body;
      if (body?.success) {
        this.toastUtil.onSuccessToast(this.translate.instant('appContinuousDelivery.toast.deploySuccess', { host: server.name }));
      }
      this.loadDeployVersions();
      this.onViewDeployLog(server);
    }, () => {
      this.deployingAsset[server.id] = false;
    });
  }

  // 部署日志(xterm)
  showDeployLog = false;
  deployLogTitle = '';
  @ViewChild('deployLogTerm') private deployLogTermRef: ElementRef;
  private deployLogXterm: Terminal;
  private deployLogFit: FitAddon;

  onViewDeployLog(server: any) {
    const res = this.deployResultMap[server.id];
    if (!res) {
      return;
    }
    this.deployLogTitle = server.name;
    this.showDeployLog = true;
    const output = res.output || '(no output)';
    setTimeout(() => {
      this.initDeployLogTerminal();
      if (this.deployLogXterm) {
        this.deployLogXterm.clear();
        this.deployLogXterm.write(output);
      }
    }, 50);
  }

  private initDeployLogTerminal() {
    if (this.deployLogXterm || !this.deployLogTermRef) {
      return;
    }
    this.deployLogXterm = this.buildXtermTheme().term;
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
}
