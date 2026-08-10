import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../@core/services/api.service';
import { RELATIVE_TIME_LIMIT } from '../../../@shared/constant/date.constant';

@Component({
  selector: 'app-image-mirror',
  templateUrl: './image-mirror.component.html',
  styleUrls: ['./image-mirror.component.less'],
})
export class ImageMirrorComponent implements OnInit, OnDestroy {

  private static readonly AUTO_REFRESH_KEY = 'image_mirror_auto_refresh';

  // 表单
  sourceImage = '';
  registries = ['acr-frankfurt-registry.eu-central-1.cr.aliyuncs.com'];
  targetRegistry = 'acr-frankfurt-registry.eu-central-1.cr.aliyuncs.com';
  targetProject = 'library';
  targetImage = '';
  targetTag = '';
  allArch = true;
  pushing = false;

  // 历史
  mirrorHistory: any[] = [];
  mirrorTotal = 0;
  pageIndex = 1;
  pageSize = 10;
  queryName = '';
  loading = false;
  protected readonly limit = RELATIVE_TIME_LIMIT;
  autoRefresh = true;
  private refreshTimer: any = null;

  constructor(private apiService: ApiService) {}

  /**
   * 根据当前表单输入实时预览目标镜像完整地址
   */
  get formTargetPreview(): string {
    const src = (this.sourceImage || '').trim().replace(/^docker\.io\//, '');
    if (!src || !this.targetRegistry) {
      return '';
    }
    const name = src.includes(':') ? src.substring(0, src.lastIndexOf(':')) : src;
    const tag = src.includes(':') ? src.substring(src.lastIndexOf(':') + 1) : 'latest';
    const baseName = name.includes('/') ? name.substring(name.lastIndexOf('/') + 1) : name;
    const ti = (this.targetImage || '').trim() || baseName;
    const tt = (this.targetTag || '').trim() || tag;
    const project = (this.targetProject || '').trim();
    return `${this.targetRegistry}/${project}/${ti}:${tt}`;
  }

  ngOnInit(): void {
    const saved = localStorage.getItem(ImageMirrorComponent.AUTO_REFRESH_KEY);
    this.autoRefresh = saved === null ? true : saved === 'true';
    this.queryHistory();
    if (this.autoRefresh) {
      this.startAutoRefresh();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  onPush() {
    if (!this.sourceImage.trim() || !this.targetRegistry) {
      return;
    }
    this.pushing = true;
    this.apiService.post('/image', '/mirror/push', {
      sourceImage: this.sourceImage.trim(),
      targetRegistry: this.targetRegistry,
      targetProject: this.targetProject?.trim() || null,
      targetImage: this.targetImage?.trim() || null,
      targetTag: this.targetTag?.trim() || null,
      allArch: this.allArch,
    }).subscribe(() => {
      this.pushing = false;
      this.queryHistory();
    }, () => {
      this.pushing = false;
    });
  }

  queryHistory(silent = false) {
    if (!silent) {
      this.loading = true;
    }
    this.apiService.post('/image', '/mirror/page/query', {
      queryName: this.queryName,
      page: this.pageIndex,
      length: this.pageSize,
    }).subscribe(({ body }: any) => {
      this.mirrorHistory = body.data || [];
      this.mirrorTotal = body.totalNum || 0;
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  onSearch() {
    this.pageIndex = 1;
    this.queryHistory();
  }

  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.queryHistory();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.queryHistory();
  }

  onDelete(rowItem: any) {
    if (!confirm('Confirm delete this record?')) {
      return;
    }
    this.apiService.delete('/image', '/mirror/del', { id: rowItem.id })
      .subscribe(() => this.queryHistory());
  }

  onAutoRefreshChange(enabled: boolean) {
    localStorage.setItem(ImageMirrorComponent.AUTO_REFRESH_KEY, enabled ? 'true' : 'false');
    if (enabled) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  private startAutoRefresh() {
    this.stopAutoRefresh();
    this.refreshTimer = setInterval(() => this.queryHistory(true), 10000);
  }

  private stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
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

  // ===== 使用示例 =====
  showUsageDialog = false;
  usageRow: any = null;

  sourceRef(row: any): string {
    return row?.sourceImage || '';
  }

  targetRef(row: any): string {
    if (!row) {
      return '';
    }
    return `${row.targetRegistry}/${row.targetProject}/${row.targetImage}:${row.targetTag}`;
  }

  onViewUsage(rowItem: any) {
    this.usageRow = rowItem;
    this.showUsageDialog = true;
  }

  /**
   * 构造使用示例的 Markdown
   */
  buildUsageMarkdown(row: any): string {
    const src = this.sourceRef(row);
    const target = this.targetRef(row);
    const fence = '```';
    return [
      '## 镜像使用说明',
      '',
      `- 源镜像（公有仓库）：\`${src}\``,
      `- 私有仓库镜像：\`${target}\``,
      '',
      '### 原始用法（公有仓库）',
      fence + 'dockerfile',
      `FROM ${src}`,
      fence,
      '',
      '### 改为私有仓库',
      fence + 'dockerfile',
      `FROM ${target}`,
      fence,
      '',
      '拉取：',
      fence + 'bash',
      `docker pull ${target}`,
      fence,
    ].join('\n');
  }

  copyUsageMarkdown() {
    const md = this.buildUsageMarkdown(this.usageRow);
    navigator.clipboard?.writeText(md);
  }
}
