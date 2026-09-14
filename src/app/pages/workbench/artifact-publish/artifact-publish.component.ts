import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiService } from '../../../@core/services/api.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { UserFavoriteService } from '../../../@core/services/user-favorite.service';
import { AddUserFavorite, RemoveUserFavorite } from '../../../@core/data/user-favorite';
import { ApplicationVO } from '../../../@core/data/application';
import { BusinessTypeEnum } from '../../../@core/data/business';
import { ToastUtil } from '../../../@shared/utils/toast.util';
import { getPopoverStyle, isDark } from '../../../@shared/utils/theme.util';
import { TerminalThemeService } from '../web-terminal/web-terminal-management/terminal-theme.service';
import { TranslateService } from '@ngx-translate/core';
import { RELATIVE_TIME_LIMIT } from '../../../@shared/constant/date.constant';

/**
 * 二方包发布(Artifact Publish)
 * 参考 SCA 页面：先做应用查询，再展示 build card。
 * 说明：当前复用 /sca/application/config/query 拉取应用的构建配置以展示 build card，
 * 后续接入独立的发布后端接口(/api/artifact/publish/...)。
 */
@Component({
  selector: 'app-artifact-publish',
  templateUrl: './artifact-publish.component.html',
  styleUrls: ['./artifact-publish.component.less'],
})
export class ArtifactPublishComponent implements OnInit, OnDestroy {

  private static readonly STORAGE_KEY = 'artifact_publish_selected_application';
  private static readonly BRANCH_MAP_KEY = 'artifact_publish_branch_by_app';
  private static readonly ONLY_MINE_KEY = 'artifact_publish_only_mine';

  /** 主题感知的 popover 样式(亮/暗自适应) */
  readonly getPopoverStyle = getPopoverStyle;

  // 应用查询
  selectedApplication: any = null;
  branch = 'master';

  // 查询结果(含 builds)
  result: any = null;
  loading = false;

  // 发布中的项目(占位，后端接入后启用)
  publishingProject: string = null;

  // 发布历史(分页)
  publishHistory: any[] = [];
  publishTotal = 0;
  publishPageIndex = 1;
  publishPageSize = 10;
  publishQueryName = '';
  publishLoading = false;
  autoRefresh = true;
  onlyMine = false;
  private refreshTimer: any = null;
  protected readonly limit = RELATIVE_TIME_LIMIT;

  // 配置帮助弹窗
  showHelp = false;
  helpTab = 'gradle';

  // ===== 制品部署申请弹窗(纯前端表单雏形) =====
  showDeployApply = false;
  deployForm: {
    applicationName: string;
    project: string;
    sshUrl: string;
    branch: string;
    jdkVersion: string;
    type: string;
    buildTool: string; // 选中的构建工具标识(决定 buildCmd)
  } = this.emptyDeployForm();

  readonly deployTypeOptions = ['maven', 'gradle'];
  readonly deployJdkOptions = ['1.8', 'jdk-11', 'jdk-17', 'jdk-21'];

  /** 各 type 可选的构建工具版本 -> 命令路径 */
  readonly deployBuildTools: { [type: string]: { id: string; label: string; cmd: string }[] } = {
    maven: [
      { id: 'maven', label: 'maven', cmd: '/opt/tools/maven/bin/mvn' },
    ],
    gradle: [
      { id: 'gradle-4.6', label: 'gradle-4.6', cmd: '/opt/tools/gradle-4.6/bin/gradle' },
      { id: 'gradle-5.6', label: 'gradle-5.6', cmd: '/opt/tools/gradle-5.6/bin/gradle' },
    ],
  };

  private emptyDeployForm() {
    return {
      applicationName: '',
      project: '',
      sshUrl: '',
      branch: '',
      jdkVersion: '1.8',
      type: 'maven',
      buildTool: 'maven',
    };
  }

  /** 当前 type 下可选的构建工具列表 */
  currentBuildTools() {
    return this.deployBuildTools[this.deployForm.type] || [];
  }

  /** 自动生成的 build 命令(取选中工具版本的路径) */
  get deployBuildCmd(): string {
    const tools = this.currentBuildTools();
    const t = tools.find((x) => x.id === this.deployForm.buildTool);
    return t ? t.cmd : (tools[0]?.cmd || '');
  }

  /** 切换 Type: 重置构建工具为该 type 的第一个 */
  onDeployTypeChange(type: string) {
    this.deployForm.type = type;
    const tools = this.deployBuildTools[type] || [];
    this.deployForm.buildTool = tools.length ? tools[0].id : '';
  }

  openDeployApply() {
    this.deployForm = this.emptyDeployForm();
    this.deployPrevAppName = '';
    this.showDeployApply = true;
  }

  /** 应用名变更时，Project 若为空或与旧应用名相同则同步默认为应用名 */
  private deployPrevAppName = '';
  onDeployAppNameChange() {
    const f = this.deployForm;
    if (!f.project?.trim() || f.project === this.deployPrevAppName) {
      f.project = f.applicationName;
    }
    this.deployPrevAppName = f.applicationName;
  }

  closeDeployApply() {
    this.showDeployApply = false;
  }

  /** 按申请格式生成 YAML 文本 */
  get deployApplyText(): string {
    const f = this.deployForm;
    const user = this.currentUsername || 'xxx';
    const branch = (f.branch || '').trim() || 'master';
    const header = this.translate.instant('artifactPublish.deployApply.requestHeader');
    return `${user} ${header}

application: ${f.applicationName || ''}

builds:
- branch: ${branch}
  buildCmd: ${this.deployBuildCmd}
  jdkVersion: '${f.jdkVersion}'
  project: ${f.project || ''}
  sshUrl: ${f.sshUrl || ''}
  type: ${f.type}`;
  }

  /** 复制申请: 校验必填 -> 生成 YAML -> 写入剪贴板 */
  copyDeployApply() {
    const f = this.deployForm;
    if (!f.applicationName?.trim() || !f.project?.trim() || !f.sshUrl?.trim()) {
      this.toastUtil.onErrorToast?.(this.translate.instant('artifactPublish.deployApply.validateRequired'));
      return;
    }
    const text = this.deployApplyText;
    const done = () => {
      this.toastUtil.onSuccessToast(this.translate.instant('artifactPublish.deployApply.copiedJump'));
      this.showDeployApply = false;
      this.openIssueGroup();
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, () => this.fallbackCopy(text, done));
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
    } catch (e) {
      this.toastUtil.onErrorToast?.(this.translate.instant('artifactPublish.deployApply.copyFailed'));
    }
    document.body.removeChild(ta);
  }

  // 版本规范说明弹窗(内容从 assets/docs/maven-version-spec.md 加载)
  showVersionSpec = false;

  /** 钉钉问题处理群加群链接 */
  private readonly issueGroupUrl = 'https://qr.dingtalk.com/action/joingroup?code=v1,k1,qYbMMEL0CS0L1d4zV/hGCRkOTvuty4o9oEG/rlJPR+hi/KBalOWoyQ==&_dt_no_comment=1&origin=11';

  /** 跳转到钉钉问题处理群 */
  openIssueGroup() {
    window.open(this.issueGroupUrl, '_blank', 'noopener');
  }

  /** Gradle build.gradle 配置样例 */
  readonly gradleBuildExample = `buildscript {
    ext {
        springBootVersion = '1.5.10.RELEASE'
    }
    repositories {
        maven { url 'https://maven.aliyun.com/nexus/content/groups/public/' }
        maven {
            url 'https://nexus.transspay.net/repository/maven-public/'
            credentials {
                // 登录制品仓库凭据使用标准变量名称
                username = mavenusername
                password = mavenpassword
            }
        }
        mavenCentral()
    }
}`;

  /** Gradle gradle.properties 配置样例(mavenusername 注入当前登录用户) */
  get gradlePropertiesExample(): string {
    const username = localStorage.getItem('username') || '你的Cratos用户名';
    return `# 此文件为用户私有文件，请勿提交到代码仓库
# 建议存放到 Gradle 用户目录下全局生效：~/.gradle/gradle.properties
mavenusername=${username}
mavenpassword=你的Cratos密码`;
  }

  // Maven settings.xml: 用户名取当前登录用户，密码由用户输入，替换模板占位并下载
  mavenSettingsPassword = '';
  showMavenPassword = false;

  /** 当前登录用户名 */
  get currentUsername(): string {
    return localStorage.getItem('username') || '';
  }

  /** settings.xml 模板(占位: {CRATOS_USERNAME} / {CRATOS_PASSWD}) */
  private readonly mavenSettingsTemplate = `<?xml version="1.0" encoding="UTF-8"?>

<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <pluginGroups>
  </pluginGroups>

  <proxies>
  </proxies>

  <servers>
    <server>
      <id>releases</id>
      <username>{CRATOS_USERNAME}</username>
      <password>{CRATOS_PASSWD}</password>
    </server>
    <server>
      <id>chuanyi-releases</id>
      <username>{CRATOS_USERNAME}</username>
      <password>{CRATOS_PASSWD}</password>
    </server>
    <server>
      <id>chuanyi-snapshots</id>
      <username>{CRATOS_USERNAME}</username>
      <password>{CRATOS_PASSWD}</password>
    </server>
    <server>
      <id>chuanyi-central</id>
      <username>{CRATOS_USERNAME}</username>
      <password>{CRATOS_PASSWD}</password>
    </server>
    <server>
      <id>chuanyi-public</id>
      <username>{CRATOS_USERNAME}</username>
      <password>{CRATOS_PASSWD}</password>
    </server>
    <server>
      <id>transsnet-releases</id>
      <username>{CRATOS_USERNAME}</username>
      <password>{CRATOS_PASSWD}</password>
    </server>
    <server>
      <id>transsnet-snapshots</id>
      <username>{CRATOS_USERNAME}</username>
      <password>{CRATOS_PASSWD}</password>
    </server>
    <server>
      <id>transsnet-public</id>
      <username>{CRATOS_USERNAME}</username>
      <password>{CRATOS_PASSWD}</password>
    </server>
  </servers>

  <mirrors>
    <mirror>
      <id>chuanyi-public</id>
      <mirrorOf>*</mirrorOf>
      <url>https://nexus.chuanyinet.com/repository/maven-public/</url>
    </mirror>

    <mirror>
      <id>transsnet-public</id>
      <mirrorOf>transsnet-public</mirrorOf>
      <url>https://nexus.transspay.net/repository/maven-public/</url>
    </mirror>

    <mirror>
        <id>nexus-aliyun</id>
        <mirrorOf>*</mirrorOf>
        <name>Nexus aliyun</name>
        <url>http://maven.aliyun.com/nexus/content/groups/public</url>
    </mirror>
  </mirrors>

  <profiles>
    <profile>
            <id>chuanyi</id>
            <repositories>
                <repository>
                    <id>chuanyi-snapshots</id>
                    <name>Team Nexus Repository</name>
                    <url>https://nexus.chuanyinet.com/repository/maven-snapshots/</url>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>chuanyi-releases</id>
                    <name>Team Nexus Repository</name>
                    <url>https://nexus.chuanyinet.com/repository/maven-releases/</url>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>transsnet-snapshots</id>
                    <name>Team Nexus Repository</name>
                    <url>https://nexus.transspay.net/repository/maven-snapshots/</url>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>transsnet-releases</id>
                    <name>Team Nexus Repository</name>
                    <url>https://nexus.transspay.net/repository/maven-releases/</url>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>chuanyi-public</id>
                    <name>Team Nexus Repository</name>
                    <url>https://nexus.chuanyinet.com/repository/maven-public/</url>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>chuanyi-central</id>
                    <name>Team Nexus Repository</name>
                    <url>https://nexus.chuanyinet.com/repository/maven-central/</url>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>central</id>
                    <name>Central Repository</name>
                    <url>http://repo.maven.apache.org/maven2</url>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>spy</id>
                    <name>Spy Repository</name>
                    <url>http://files.couchbase.com/maven2/</url>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </repository>
            </repositories>

            <pluginRepositories>
                <pluginRepository>
                    <id>chuanyi</id>
                    <name>Team Nexus Repository</name>
                    <url>https://nexus.chuanyinet.com/repository/maven-releases/</url>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>

      <profile>
        <id>transsnet</id>
        <repositories>
          <repository>
            <id>transsnet-public</id>
            <name>Team Nexus Repository</name>
            <url>https://nexus.transspay.net/repository/maven-public/</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
          </repository>
          <repository>
            <id>chuanyi-public</id>
            <name>Team Nexus Repository</name>
            <url>https://nexus.chuanyinet.com/repository/maven-public/</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
          </repository>
        </repositories>
    </profile>
  </profiles>

  <activeProfiles>
     <activeProfile>chuanyi</activeProfile>
     <activeProfile>transsnet</activeProfile>
  </activeProfiles>
</settings>`;

  /** XML 转义(防止用户名/密码中的特殊字符破坏 XML) */
  private xmlEscape(s: string): string {
    return (s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /** 用当前用户名 + 输入密码替换占位并下载 settings.xml */
  downloadMavenSettings(): void {
    if (!this.mavenSettingsPassword) {
      return;
    }
    const user = this.xmlEscape(this.currentUsername);
    const pass = this.xmlEscape(this.mavenSettingsPassword);
    const content = this.mavenSettingsTemplate
      .replace(/\{CRATOS_USERNAME\}/g, user)
      .replace(/\{CRATOS_PASSWD\}/g, pass);
    const blob = new Blob([content], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.toastUtil.onSuccessToast(this.translate.instant('artifactPublish.toast.settingsGenerated'));
  }

  // 制品仓库(完整 URL，自动按版本匹配 snapshots/releases，可手动切换)
  readonly repositoryOptions = [
    'https://nexus.chuanyinet.com/repository/maven-snapshots/',
    'https://nexus.chuanyinet.com/repository/maven-releases/',
    'https://nexus.transspay.net/repository/maven-snapshots/',
    'https://nexus.transspay.net/repository/maven-releases/',
  ];

  constructor(
    private apiService: ApiService,
    private applicationService: ApplicationService,
    private toastUtil: ToastUtil,
    private terminalThemeService: TerminalThemeService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private userFavoriteService: UserFavoriteService,
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem(ArtifactPublishComponent.STORAGE_KEY);
    if (saved) {
      try {
        this.selectedApplication = JSON.parse(saved);
      } catch (e) {}
    }
    // 恢复该应用关联的分支
    const savedBranch = this.loadBranchForApp(this.selectedApplication?.name);
    if (savedBranch) {
      this.branch = savedBranch;
    }
    // 恢复"只看我的"持久化状态
    this.onlyMine = localStorage.getItem(ArtifactPublishComponent.ONLY_MINE_KEY) === 'true';
    // 加载发布历史 + 自动刷新
    this.queryPublishHistory();
    this.startAutoRefresh();
    this.loadFavoriteApplications();

    // URL 参数自动化发布: ?applicationName=&project=&branch=&moduleName=&confirm=yes
    const qp = this.route.snapshot.queryParams;
    if (qp['applicationName'] && qp['project']) {
      this.autoPublishFromUrl({
        applicationName: qp['applicationName'],
        project: qp['project'],
        branch: qp['branch'] || 'master',
        moduleName: qp['moduleName'] || '',
        repository: qp['repository'] || '',
        confirm: (qp['confirm'] || '').toLowerCase() === 'yes',
      });
    }
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
    this.stopLogPolling();
    this.disposeTerminal();
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

  /** 按发布单号打开并流式加载 Jenkins 构建日志 */
  onViewLog(rowItem: any) {
    this.stopLogPolling();
    this.disposeTerminal();
    this.logScan = rowItem;
    this.logNextStart = 0;
    this.logRaw = '';
    this.logWritten = 0;
    this.showLogDialog = true;
    this.logLoading = true;
    // 等弹窗 DOM 渲染后再初始化终端并开始轮询
    setTimeout(() => {
      this.initTerminal();
      this.pollLog();
    }, 50);
  }

  private initTerminal() {
    if (this.xterm || !this.logTermRef) {
      return;
    }
    // 复用 web-terminal 的主题配色/字体
    const t = this.terminalThemeService.getCurrentTheme();
    const c = t.colors;
    this.xterm = new Terminal({
      fontFamily: t.fontFamily || '"SFMono-Regular", Consolas, "Courier New", monospace',
      fontSize: t.fontSize || 12,
      lineHeight: t.lineHeight || 1.2,
      cursorBlink: false,
      disableStdin: true,      // 只读日志
      convertEol: true,        // \n 视为回车换行
      scrollback: 100000,      // 构建日志较长, 加大缓冲
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
    // 弹窗展开/尺寸稳定后多次 fit, 避免初始宽度未定导致换行错位
    this.safeFit();
    setTimeout(() => this.safeFit(), 60);
    setTimeout(() => this.safeFit(), 250);
    // 容器尺寸变化(弹窗动画、窗口缩放)时自动重排
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

  /** 日志终端背景色(取 web-terminal 当前主题背景) */
  get logTermBg(): string {
    return this.terminalThemeService.getCurrentTheme()?.colors?.background || '#1e1e1e';
  }

  private pollLog() {
    if (!this.showLogDialog || !this.logScan) {
      return;
    }
    this.apiService.post('/application', '/artifact/publish/publish/log/query', {
      publishNo: this.logScan.publishNo,
      start: this.logNextStart,
    }).subscribe(({ body }: any) => {
      this.logLoading = false;
      if (!body || !this.showLogDialog) {
        return;
      }
      // 写入原始增量: xterm 原生处理 ANSI 颜色 / \r 进度回写; ConsoleNote(ESC[8m..ESC[0m) 需自行剥离
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

  /**
   * 将累积原始日志中"可安全写入"的增量剥离 ConsoleNote 后写入 xterm。
   * 为兼容分块边界: 遇到未闭合的 ESC[8m 或结尾不完整的转义序列时, 本次保留、下次再写。
   */
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
    // 未闭合的 ConsoleNote(ESC[8m 之后还没出现 ESC[0m): 从该处起保留到下次
    const lastOpen = pending.lastIndexOf(esc + '[8m');
    const lastClose = pending.lastIndexOf(esc + '[0m');
    if (lastOpen !== -1 && lastOpen > lastClose) {
      safe = Math.min(safe, lastOpen);
    }
    // 结尾悬挂的不完整转义(如以 ESC 或 ESC[.. 结尾): 截断到它之前
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

  // ===== 发布历史(分页) =====
  queryPublishHistory(silent = false) {
    if (!silent) {
      this.publishLoading = true;
    }
    this.apiService.post('/application', '/artifact/publish/publish/page/query', {
      queryName: this.publishQueryName,
      username: this.onlyMine ? this.currentUsername : null,
      page: this.publishPageIndex,
      length: this.publishPageSize,
    }).subscribe(({ body }: any) => {
      this.publishHistory = body?.data || [];
      this.publishTotal = body?.totalNum || 0;
      this.publishLoading = false;
    }, () => {
      this.publishLoading = false;
    });
  }

  onPublishSearch() {
    this.publishPageIndex = 1;
    this.queryPublishHistory();
  }

  /** "只看我的"切换: 持久化并重新查询 */
  onOnlyMineChange(checked: boolean) {
    localStorage.setItem(ArtifactPublishComponent.ONLY_MINE_KEY, checked ? 'true' : 'false');
    this.onPublishSearch();
  }

  // ===== 发布报表 =====
  showReport = false;
  reportLoading = false;
  reportDays = 30;
  report: any = null;
  trendOption: any = null;
  statusOption: any = null;
  buildTypeOption: any = null;
  repoOption: any = null;
  topAppsOption: any = null;
  topPublishersOption: any = null;

  /** 打开报表弹窗并加载 */
  openReport() {
    this.showReport = true;
    this.loadReport();
  }

  /** 切换统计区间 */
  onReportRangeChange(days: number) {
    if (this.reportDays === days) {
      return;
    }
    this.reportDays = days;
    this.loadReport();
  }

  /** 拉取报表数据并生成图表 */
  loadReport() {
    this.reportLoading = true;
    this.apiService.post('/application', '/artifact/publish/publish/report/query', {
      days: this.reportDays,
      username: this.onlyMine ? this.currentUsername : null,
    }).subscribe(({ body }: any) => {
      this.report = body || {};
      this.buildReportCharts();
      this.reportLoading = false;
    }, () => {
      this.reportLoading = false;
    });
  }

  private buildReportCharts() {
    const r = this.report || {};
    const t = (k: string) => this.translate.instant('artifactPublish.report.' + k);
    const nameCounts = (arr: any[]) => (arr || []).map((x) => ({ name: x.name, value: x.count }));

    // 趋势(成功/失败堆叠柱)
    const trend = r.trend || [];
    this.trendOption = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: [t('trendSuccess'), t('trendFailed')] },
      grid: { left: 40, right: 16, top: 30, bottom: 24 },
      xAxis: { type: 'category', data: trend.map((p: any) => p.date) },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        { name: t('trendSuccess'), type: 'bar', stack: 'total', itemStyle: { color: '#50D4AB' }, data: trend.map((p: any) => p.success) },
        { name: t('trendFailed'), type: 'bar', stack: 'total', itemStyle: { color: '#F66F6A' }, data: trend.map((p: any) => p.failed) },
      ],
    };

    // 状态分布(饼)
    this.statusOption = this.pieOption(nameCounts(r.statusDistribution));
    // 构建类型(饼)
    this.buildTypeOption = this.pieOption(nameCounts(r.buildTypeDistribution));
    // 仓库分布(横向柱)
    this.repoOption = this.barOption(r.repositoryDistribution);
    // Top 应用(横向柱)
    this.topAppsOption = this.barOption(r.topApplications);
    // 发布人排行(横向柱)
    this.topPublishersOption = this.barOption(r.topPublishers);
  }

  private pieOption(data: any[]) {
    const textColor = isDark() ? '#d0d3db' : '#252b3a';
    return {
      textStyle: { color: textColor },
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { type: 'scroll', bottom: 0, textStyle: { color: textColor } },
      series: [
        {
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          label: { show: true, color: textColor, formatter: '{b}\n{c}' },
          labelLine: { lineStyle: { color: textColor } },
          data: data || [],
        },
      ],
    };
  }

  private barOption(list: any[]) {
    const arr = (list || []).slice()
      .reverse();
    const textColor = isDark() ? '#d0d3db' : '#252b3a';
    return {
      textStyle: { color: textColor },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 8, right: 24, top: 16, bottom: 16, containLabel: true },
      xAxis: { type: 'value', minInterval: 1 },
      yAxis: { type: 'category', data: arr.map((x: any) => x.name) },
      series: [
        {
          type: 'bar',
          barMaxWidth: 18,
          itemStyle: { color: '#5E7CE0' },
          label: { show: true, position: 'right', color: textColor },
          data: arr.map((x: any) => x.count),
        },
      ],
    };
  }

  /** 删除发布记录(仅非成功记录，进行中的记录后端也会拒绝) */
  onDeletePublish(rowItem: any) {
    if (rowItem.publishStatus === 'SUCCESS') {
      return;
    }
    if (!confirm(this.translate.instant('artifactPublish.toast.deleteConfirm', { publishNo: rowItem.publishNo }))) {
      return;
    }
    this.apiService.post('/application', '/artifact/publish/publish/delete', { id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(this.translate.instant('artifactPublish.toast.deleted'));
        this.queryPublishHistory();
      });
  }

  onPublishPageIndexChange(pageIndex: number) {
    this.publishPageIndex = pageIndex;
    this.queryPublishHistory();
  }

  onPublishPageSizeChange(pageSize: number) {
    this.publishPageSize = pageSize;
    this.publishPageIndex = 1;
    this.queryPublishHistory();
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
    this.refreshTimer = setInterval(() => this.queryPublishHistory(true), 10000);
  }

  private stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
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
      return `${h} 小时 ${m} 分`;
    }
    if (m > 0) {
      return `${m} 分 ${s} 秒`;
    }
    return `${s} 秒`;
  }

  /** Maven 依赖配置样例 */
  mavenSnippet(row: any): string {
    return `<dependency>
    <groupId>${row.groupId}</groupId>
    <artifactId>${row.artifactId}</artifactId>
    <version>${row.version}</version>
</dependency>`;
  }

  /** Gradle 依赖配置样例 */
  gradleSnippet(row: any): string {
    return `implementation '${row.groupId}:${row.artifactId}:${row.version}'`;
  }

  /** 组件在 Nexus UI 浏览页地址(定位到 artifactId 一级): host/#browse/browse:repo:encoded(group/artifactId) */
  artifactUrl(row: any): string {
    if (!row?.repository || !row?.groupId || !row?.artifactId) {
      return '';
    }
    const path = row.groupId.replace(/\./g, '/') + '/' + row.artifactId + (row.version ? '/' + row.version : '');
    // 从仓库 URL 解析 host 与仓库名: https://host/repository/<repo>/
    const m = row.repository.match(/^(https?:\/\/[^/]+)\/repository\/([^/]+)/);
    if (m) {
      return `${m[1]}/#browse/browse:${m[2]}:${encodeURIComponent(path)}`;
    }
    // 兜底: 直接用仓库内容路径
    return `${row.repository.replace(/\/+$/, '')}/${path}/`;
  }

  onCopied() {
    this.toastUtil.onSuccessToast(this.translate.instant('artifactPublish.toast.copied'));
  }

  /** Jenkins 构建地址: https://<instanceName>/job/<jobName>/<buildId>/ */
  getBuildUrl(rowItem: any): string {
    if (rowItem.instanceName && rowItem.jobName && rowItem.buildId) {
      return `https://${rowItem.instanceName}/job/${rowItem.jobName}/${rowItem.buildId}/`;
    }
    return '';
  }

  /** 最终可跳转的构建地址: 优先 buildUrl, 回退 getBuildUrl; 仅返回绝对 http(s) 地址, 否则空 */
  buildLink(rowItem: any): string {
    const url = rowItem?.buildUrl || this.getBuildUrl(rowItem);
    return /^https?:\/\//.test(url || '') ? url : '';
  }

  /** 读取“应用 -> 分支”映射 */
  private loadBranchMap(): { [appName: string]: string } {
    try {
      return JSON.parse(localStorage.getItem(ArtifactPublishComponent.BRANCH_MAP_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  /** 取指定应用记住的分支 */
  private loadBranchForApp(appName?: string): string {
    if (!appName) {
      return '';
    }
    return this.loadBranchMap()[appName] || '';
  }

  /** 分支输入框失焦时去除首尾空格 */
  onBranchBlur() {
    this.branch = (this.branch || '').trim();
    this.onBranchChange();
  }

  /** 分支变更时按当前应用持久化(去除首尾空格) */
  onBranchChange() {
    const appName = this.selectedApplication?.name;
    if (!appName) {
      return;
    }
    const map = this.loadBranchMap();
    map[appName] = (this.branch || '').trim() || 'master';
    localStorage.setItem(ArtifactPublishComponent.BRANCH_MAP_KEY, JSON.stringify(map));
  }

  /** 归一化后的分支(去首尾空格, 空则 master) */
  private currentBranch(): string {
    return (this.branch || '').trim() || 'master';
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
      localStorage.setItem(ArtifactPublishComponent.STORAGE_KEY, JSON.stringify({ name: app.name, comment: app.comment }));
      // 切换应用时恢复该应用关联的分支(无记录则默认 master)
      this.branch = this.loadBranchForApp(app.name) || 'master';
    } else {
      localStorage.removeItem(ArtifactPublishComponent.STORAGE_KEY);
      this.branch = 'master';
    }
  }

  /** 当前选中应用是否已收藏 */
  isCurrentFavorite(): boolean {
    const name = this.selectedApplication?.name;
    if (!name) {
      return false;
    }
    return this.favoriteApplicationList.some((a) => a.name === name);
  }

  /** 收藏/取消收藏 当前选中应用 */
  onToggleCurrentFavorite() {
    const app = this.selectedApplication;
    if (!app?.name) {
      return;
    }
    if (this.isCurrentFavorite()) {
      const fav = this.favoriteApplicationList.find((a) => a.name === app.name);
      const param: RemoveUserFavorite = {
        businessType: BusinessTypeEnum.APPLICATION,
        businessId: fav?.id ?? app.id,
      };
      this.userFavoriteService.removeApplicationFavorite(param)
        .subscribe(() => {
          this.toastUtil.onSuccessToast(this.translate.instant('artifactPublish.toast.deleted'));
          this.loadFavoriteApplications();
        });
    } else {
      // selectedApplication 可能来自 localStorage 恢复/收藏面板/自动发布(无 id), 需先按 name 查出 id
      if (app.id != null) {
        this.doAddFavorite(app.id, app.name);
      } else {
        this.applicationService.getApplicationByName({ name: app.name })
          .subscribe(({ body }: any) => {
            if (body?.id != null) {
              this.doAddFavorite(body.id, app.name);
            }
          });
      }
    }
  }

  private doAddFavorite(businessId: number, name: string) {
    const param: AddUserFavorite = {
      businessType: BusinessTypeEnum.APPLICATION,
      businessId,
      name,
    };
    this.userFavoriteService.addApplicationFavorite(param)
      .subscribe(() => {
        this.toastUtil.onSuccessToast(this.translate.instant('artifactPublish.toast.favorited'));
        this.loadFavoriteApplications();
      });
  }

  // ===== 我的收藏应用 =====
  favoriteApplicationList: ApplicationVO[] = [];

  loadFavoriteApplications() {
    this.userFavoriteService.getMyFavoriteApplication()
      .subscribe(({ body }: any) => {
        this.favoriteApplicationList = body || [];
      });
  }

  /** 点击收藏应用: 选中到应用选择框并查询构建 */
  onSelectFavorite(application: ApplicationVO) {
    this.onApplicationChange({ name: application.name, comment: application.comment });
    this.onQuery();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {}
  }

  /** 取消收藏 */
  onRemoveFavorite(application: ApplicationVO) {
    const param: RemoveUserFavorite = {
      businessType: BusinessTypeEnum.APPLICATION,
      businessId: application.id,
    };
    this.userFavoriteService.removeApplicationFavorite(param)
      .subscribe(() => {
        this.toastUtil.onSuccessToast(this.translate.instant('artifactPublish.toast.deleted'));
        this.loadFavoriteApplications();
      });
  }

  /** 从发布历史行"重新部署": 把应用+分支填入顶部搜索项并重新查询构建 */
  onRedeploy(rowItem: any) {
    if (!rowItem?.applicationName) {
      return;
    }
    // 填入应用(触发持久化与分支恢复)
    this.onApplicationChange({ name: rowItem.applicationName, comment: rowItem.applicationName });
    // 覆盖为该记录的分支
    this.branch = (rowItem.branch || 'master').trim() || 'master';
    this.onBranchChange();
    // 重新查询该应用的可发布构建
    this.onQuery();
    // 滚动到顶部, 便于查看搜索栏与构建卡片
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
      branch: this.currentBranch(),
    }).subscribe(({ body }: any) => {
      this.result = body;
      this.loading = false;
      // 为每个 build card 加载 SCA 内部模块(按 应用+gitUrl)，做成 tab 供选择发布模块
      (this.result?.builds || []).forEach((build: any) => this.fetchInternalModules(build));
      // 统计该应用各模块历史发布成功次数(用于模块 tab 徽标)
      this.loadPublishCounts();
    }, () => {
      this.loading = false;
    });
  }

  // ===== 选择 Project 弹窗（按分支查配置列出 builds；分支选项复用 /sca 接口） =====
  showBuildPicker = false;
  buildPickerLoading = false;
  buildPickerList: any[] = [];
  selectedBuild: any = null;
  branchOptionsLoading = false;
  branchSelectOptions: any[] = []; // 扁平: [{ label, value, group, desc }]
  selectedBranchOption: any = null; // d-select 绑定的选项对象
  selectedBranch: string = null;    // 派生的分支名字符串

  /** 分支框 d-search 的搜索动作: 持久化当前分支并弹出 project 选择 */
  onBranchSearch() {
    this.onBranchChange();
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
    this.apiService.post('/sca', '/application/config/query', {
      applicationName: this.selectedApplication.name,
      branch: this.currentBranch(),
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

  /** 弹窗内 d-select 选中变化: 派生分支名字符串 (区别于页面级 onBranchChange) */
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

  /** 确认分支: 填回主搜索的分支输入框(并触发已有的分支持久化)并关闭弹窗 */
  confirmBranch() {
    if (this.selectedBranch) {
      this.branch = this.selectedBranch;
      this.onBranchChange();
    }
    this.showBuildPicker = false;
  }
  publishCountMap: { [artifactId: string]: number } = {};

  /** 拉取该应用发布历史(大页), 按 artifactId 统计 SUCCESS 次数 */
  private loadPublishCounts() {
    const appName = this.selectedApplication?.name;
    if (!appName) {
      return;
    }
    this.apiService.post('/application', '/artifact/publish/publish/page/query', {
      queryName: '',
      username: null,
      applicationName: appName,
      page: 1,
      length: 1000,
    }).subscribe(({ body }: any) => {
      const map: { [k: string]: number } = {};
      (body?.data || []).forEach((r: any) => {
        if (r.applicationName === appName && r.publishStatus === 'SUCCESS' && r.artifactId) {
          map[r.artifactId] = (map[r.artifactId] || 0) + 1;
        }
      });
      this.publishCountMap = map;
    });
  }

  /** 取某模块(artifactId)的历史发布次数 */
  publishCountOf(artifactId: string): number {
    return (artifactId && this.publishCountMap[artifactId]) || 0;
  }

  /**
   * 查询该 build 对应仓库(应用+gitUrl)最近一次 SCA 扫描的内部模块清单，作为可发布模块 tab。
   */
  fetchInternalModules(build: any) {
    const gitUrl = build?.buildProject?.repository?.sshUrl;
    if (!gitUrl) {
      build.internalModules = [];
      return;
    }
    build.internalModulesLoading = true;
    build.publishKind = build.publishKind || 'module';
    this.apiService.post('/sca', '/scan/internal-module/query-by-app', {
      applicationName: this.selectedApplication?.name,
      gitUrl,
    }).subscribe(({ body }: any) => {
      build.internalModules = body || [];
      // 默认选中第一个模块
      build.selectedModuleId = build.internalModules.length
        ? this.moduleId(build.internalModules[0])
        : null;
      build.internalModulesLoading = false;
      this.fetchModuleVersion(build);
    }, () => {
      build.internalModules = [];
      build.internalModulesLoading = false;
    });
  }

  /** 模块唯一标识 groupId:artifactId */
  moduleId(m: any): string {
    return (m?.groupId || '') + ':' + (m?.artifactId || '');
  }

  /** dependency 唯一标识 group:name */
  dependencyId(d: any): string {
    return (d?.group || '') + ':' + (d?.name || '');
  }

  /** 切换发布类型(module / dependency), 重置选中并按类型查版本 */
  onPublishKindChange(build: any, kind: string) {
    build.publishKind = kind;
    build.selectedVersion = null;
    if (kind === 'dependency') {
      build.selectedDependencyId = build.dependencies?.length ? this.dependencyId(build.dependencies[0]) : null;
      this.fetchDependencyVersion(build);
    } else {
      build.selectedModuleId = build.internalModules?.length ? this.moduleId(build.internalModules[0]) : null;
      this.fetchModuleVersion(build);
    }
  }

  onDependencyTabChange(build: any, dependencyId: string) {
    build.selectedDependencyId = dependencyId;
    this.fetchDependencyVersion(build);
  }

  /** 返回当前选中的 dependency 对象 */
  getSelectedDependency(build: any): any {
    if (!build?.dependencies?.length || !build.selectedDependencyId) {
      return null;
    }
    return build.dependencies.find((d: any) => this.dependencyId(d) === build.selectedDependencyId) || null;
  }

  /** 是否为 dependency 发布模式 */
  isDependencyKind(build: any): boolean {
    return build?.publishKind === 'dependency';
  }

  /** 当前选中项(module 或 dependency)统一为 {groupId, artifactId}, 用于展示与发布 */
  getSelectedItem(build: any): any {
    if (this.isDependencyKind(build)) {
      const d = this.getSelectedDependency(build);
      return d ? { groupId: d.group, artifactId: d.name, path: d.path } : null;
    }
    return this.getSelectedModule(build);
  }

  /** 查询选中 dependency 的版本(读取 path/pom.xml 的 <version>) */
  fetchDependencyVersion(build: any) {
    const d = this.getSelectedDependency(build);
    const gitUrl = build?.buildProject?.repository?.sshUrl;
    build.selectedVersion = null;
    if (!d || !gitUrl) {
      return;
    }
    build.versionLoading = true;
    this.apiService.post('/application', '/artifact/publish/module/version/query', {
      applicationName: this.selectedApplication?.name,
      gitUrl,
      ref: this.currentBranch(),
      project: build.project,
      groupId: d.group,
      artifactId: d.name,
      buildType: build.type,
      isDependency: true,
      path: d.path,
    }).subscribe(({ body }: any) => {
      build.selectedVersion = body?.version || null;
      build.versionLoading = false;
      this.autoMatchRepository(build);
    }, () => {
      build.versionLoading = false;
    });
  }

  onModuleTabChange(build: any, moduleId: string) {
    build.selectedModuleId = moduleId;
    this.fetchModuleVersion(build);
  }

  /** 返回当前选中的内部模块对象(用于展示 GroupId/ArtifactId) */
  getSelectedModule(build: any): any {
    if (!build?.internalModules?.length || !build.selectedModuleId) {
      return null;
    }
    return build.internalModules.find((m: any) => this.moduleId(m) === build.selectedModuleId) || null;
  }

  /** 校验版本号是否符合规范(SemVer: MAJOR.MINOR.PATCH[-限定符][+构建元数据]) */
  isValidVersion(version: string): boolean {
    if (!version) {
      return false;
    }
    return /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/.test(version.trim());
  }

  /** 查询选中模块的版本(读取仓库 pom 解析) */
  fetchModuleVersion(build: any) {
    const sm = this.getSelectedModule(build);
    const gitUrl = build?.buildProject?.repository?.sshUrl;
    build.selectedVersion = null;
    if (!sm || !gitUrl) {
      return;
    }
    build.versionLoading = true;
    this.apiService.post('/application', '/artifact/publish/module/version/query', {
      applicationName: this.selectedApplication?.name,
      gitUrl,
      ref: this.currentBranch(),
      project: build.project,
      groupId: sm.groupId,
      artifactId: sm.artifactId,
      buildType: build.type,
    }).subscribe(({ body }: any) => {
      build.selectedVersion = body?.version || null;
      build.versionLoading = false;
      this.autoMatchRepository(build);
    }, () => {
      build.versionLoading = false;
    });
  }

  /** 根据版本类型返回可选的制品仓库(SNAPSHOT->snapshots, 否则 releases) */
  repositoryOptionsFor(build: any): string[] {
    const v = (build?.selectedVersion || '').toUpperCase();
    if (!v) {
      return [];
    }
    const snapshot = v.includes('SNAPSHOT');
    return this.repositoryOptions.filter(u => snapshot ? u.includes('snapshot') : !u.includes('snapshot'));
  }

  /** 制品仓库 tab 的展示标签: host-类型 */
  repoLabel(url: string): string {
    if (!url) {
      return '';
    }
    const host = url.includes('transspay') ? 'transspay' : 'chuanyi';
    const type = url.includes('snapshot') ? 'snapshots' : 'releases';
    return host + '-' + type;
  }

  /** 根据版本自动匹配制品仓库(完整 URL): 默认选中该类型下的第一个(chuanyi) */
  autoMatchRepository(build: any) {
    const options = this.repositoryOptionsFor(build);
    build.repository = options.length ? options[0] : null;
  }

  onPublish(build: any) {
    const isDependency = this.isDependencyKind(build);
    const item = this.getSelectedItem(build);
    if (!item || !build.selectedVersion || this.publishingProject === build.project) {
      return;
    }
    this.publishingProject = build.project;
    this.apiService.post('/application', '/artifact/publish/publish', {
      applicationName: this.selectedApplication?.name,
      branch: this.currentBranch(),
      project: build.project,
      isDependency,
      moduleName: item.artifactId,
      groupId: item.groupId,
      artifactId: item.artifactId,
      version: build.selectedVersion,
      repository: build.repository,
    }).subscribe(() => {
      this.publishingProject = null;
      this.toastUtil.onSuccessToast(this.translate.instant('artifactPublish.toast.publishTriggered'));
      this.queryPublishHistory();
      this.loadPublishCounts();
    }, () => {
      this.publishingProject = null;
    });
  }

  // ===== URL 参数自动化发布 =====
  /** 自动化处理中标志(避免重复触发) */
  autoRunning = false;

  // ===== 自动化调用命令示例(Mac open) 弹窗 =====
  showAutoCmd = false;
  autoCmdBuild: any = null;

  /** 打开某 build 的自动化命令示例弹窗 */
  onShowAutoCmd(build: any) {
    this.autoCmdBuild = build;
    this.showAutoCmd = true;
  }

  closeAutoCmd() {
    this.showAutoCmd = false;
    this.autoCmdBuild = null;
  }

  /** 当前选中模块/二方包的名称(用作 moduleName) */
  autoCmdSelectedModuleName(build: any): string {
    const item = this.getSelectedItem(build);
    return item?.artifactId || '';
  }

  /** 生成单个模块的 Mac open 自动化发布命令 */
  autoCmdLine(build: any, moduleName: string): string {
    const origin = window.location.origin;
    const params = [
      'applicationName=' + encodeURIComponent(this.selectedApplication?.name || ''),
      'project=' + encodeURIComponent(build?.project || ''),
      'branch=' + encodeURIComponent(this.currentBranch()),
      'moduleName=' + encodeURIComponent(moduleName || ''),
    ];
    if (build?.repository) {
      params.push('repository=' + encodeURIComponent(build.repository));
    }
    params.push('confirm=yes');
    const url = `${origin}/#/pages/workbench/artifact-publish?${params.join('&')}`;
    return `open -a "Google Chrome" "${url}"`;
  }

  /**
   * 轮询等待条件成立(带超时)。cond() 返回 true 则 resolve, 超时 reject。
   */
  private waitFor(cond: () => boolean, timeoutMs = 20000, intervalMs = 200): Promise<void> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        if (cond()) {
          clearInterval(timer);
          resolve();
        } else if (Date.now() - start > timeoutMs) {
          clearInterval(timer);
          reject(new Error('timeout'));
        }
      }, intervalMs);
    });
  }

  /**
   * 根据 URL 参数自动预填并(可选)自动发布二方包。
   * 流程: 设应用/分支 -> 查 builds -> 定位 project 对应 build -> 选模块(module 或 dependency)
   *      -> 等版本+仓库就位 -> confirm=yes 则自动发布, 否则仅定位等待用户确认。
   */
  private async autoPublishFromUrl(cfg: { applicationName: string; project: string; branch: string; moduleName: string; repository: string; confirm: boolean }) {
    if (this.autoRunning) {
      return;
    }
    this.autoRunning = true;
    try {
      // 1. 设应用 + 分支
      this.onApplicationChange({ name: cfg.applicationName, comment: cfg.applicationName });
      this.branch = (cfg.branch || 'master').trim() || 'master';
      this.onBranchChange();

      // 2. 查询可发布构建
      this.onQuery();
      await this.waitFor(() => Array.isArray(this.result?.builds) && this.result.builds.length > 0);

      // 3. 定位 project 对应的 build
      const build = this.result.builds.find((b: any) => b.project === cfg.project);
      if (!build) {
        this.toastUtil.onErrorToast?.(this.translate.instant('artifactPublish.auto.buildNotFound', { project: cfg.project }));
        return;
      }

      // 4. 等内部模块/依赖加载完成(fetchInternalModules 完成后 internalModulesLoading=false)
      await this.waitFor(() => build.internalModulesLoading === false || Array.isArray(build.internalModules));

      // 5. 按 moduleName 选中 module 或 dependency
      if (cfg.moduleName) {
        const module = (build.internalModules || []).find((m: any) => m.artifactId === cfg.moduleName);
        const dependency = (build.dependencies || []).find((d: any) => d.name === cfg.moduleName);
        if (module) {
          if (build.publishKind !== 'module') {
            this.onPublishKindChange(build, 'module');
          }
          this.onModuleTabChange(build, this.moduleId(module));
        } else if (dependency) {
          this.onPublishKindChange(build, 'dependency');
          this.onDependencyTabChange(build, this.dependencyId(dependency));
        } else {
          this.toastUtil.onErrorToast?.(this.translate.instant('artifactPublish.auto.moduleNotFound', { moduleName: cfg.moduleName }));
          return;
        }
      }
      // 未指定 moduleName 时沿用默认选中(第一个模块), fetchInternalModules 已触发查版本

      // 6. 等版本与制品仓库就位
      await this.waitFor(() => !!build.selectedVersion && build.versionLoading !== true);
      await this.waitFor(() => !!build.repository, 5000);

      // 6b. URL 指定了推送仓库则覆盖(需在该版本允许的仓库选项内, 否则保留自动匹配并告警)
      if (cfg.repository) {
        const options = this.repositoryOptionsFor(build);
        if (options.includes(cfg.repository)) {
          build.repository = cfg.repository;
        } else {
          this.toastUtil.onErrorToast?.(this.translate.instant('artifactPublish.auto.repositoryInvalid', { repository: cfg.repository }));
        }
      }

      // 定位到构建卡片
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {}

      // 7. confirm=yes 自动发布; 否则仅提示用户确认
      if (cfg.confirm) {
        this.onPublish(build);
      } else {
        this.toastUtil.onSuccessToast(this.translate.instant('artifactPublish.auto.readyToPublish'));
      }
    } catch (e) {
      this.toastUtil.onErrorToast?.(this.translate.instant('artifactPublish.auto.timeout'));
    } finally {
      this.autoRunning = false;
    }
  }

}
