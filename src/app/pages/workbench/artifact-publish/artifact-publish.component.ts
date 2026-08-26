import { Component, OnInit, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../@core/services/api.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { ToastUtil } from '../../../@shared/utils/toast.util';
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
  private refreshTimer: any = null;
  protected readonly limit = RELATIVE_TIME_LIMIT;

  // 配置帮助弹窗
  showHelp = false;
  helpTab = 'gradle';

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
            <url>https://nexus.chuanyinet.com/repository/maven-public/</url>
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
    this.toastUtil.onSuccessToast('settings.xml 已生成下载');
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
    // 加载发布历史 + 自动刷新
    this.queryPublishHistory();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  // ===== 发布历史(分页) =====
  queryPublishHistory(silent = false) {
    if (!silent) {
      this.publishLoading = true;
    }
    this.apiService.post('/application', '/artifact/publish/publish/page/query', {
      queryName: this.publishQueryName,
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

  /** 删除发布记录(仅非成功记录，进行中的记录后端也会拒绝) */
  onDeletePublish(rowItem: any) {
    if (rowItem.publishStatus === 'SUCCESS') {
      return;
    }
    if (!confirm(`确认删除发布记录 ${rowItem.publishNo} ?`)) {
      return;
    }
    this.apiService.post('/application', '/artifact/publish/publish/delete', { id: rowItem.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast('已删除');
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
    this.toastUtil.onSuccessToast('已复制到剪贴板');
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
    }, () => {
      this.loading = false;
    });
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
    const sm = this.getSelectedModule(build);
    if (!sm || !build.selectedVersion || this.publishingProject === build.project) {
      return;
    }
    this.publishingProject = build.project;
    this.apiService.post('/application', '/artifact/publish/publish', {
      applicationName: this.selectedApplication?.name,
      branch: this.currentBranch(),
      project: build.project,
      moduleName: sm.artifactId,
      groupId: sm.groupId,
      artifactId: sm.artifactId,
      version: build.selectedVersion,
      repository: build.repository,
    }).subscribe(() => {
      this.publishingProject = null;
      this.toastUtil.onSuccessToast('发布已触发');
      this.queryPublishHistory();
    }, () => {
      this.publishingProject = null;
    });
  }

}
