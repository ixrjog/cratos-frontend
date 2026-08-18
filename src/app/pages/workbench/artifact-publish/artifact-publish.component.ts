import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../@core/services/api.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { ToastUtil } from '../../../@shared/utils/toast.util';

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
export class ArtifactPublishComponent implements OnInit {

  private static readonly STORAGE_KEY = 'artifact_publish_selected_application';

  // 应用查询
  selectedApplication: any = null;
  branch = 'master';

  // 查询结果(含 builds)
  result: any = null;
  loading = false;

  // 发布中的项目(占位，后端接入后启用)
  publishingProject: string = null;

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
    } else {
      localStorage.removeItem(ArtifactPublishComponent.STORAGE_KEY);
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
      ref: this.branch || 'master',
      project: build.project,
      groupId: sm.groupId,
      artifactId: sm.artifactId,
      buildType: build.type,
    }).subscribe(({ body }: any) => {
      build.selectedVersion = body?.version || null;
      build.versionLoading = false;
    }, () => {
      build.versionLoading = false;
    });
  }

  onPublish(build: any) {
    // 占位：发布后端接口就绪后替换为 /api/artifact/publish 调用
    this.toastUtil.onSuccessToast('发布功能开发中，敬请期待');
  }

}
