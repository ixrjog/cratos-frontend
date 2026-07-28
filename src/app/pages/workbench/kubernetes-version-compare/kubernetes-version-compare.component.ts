import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../@core/services/api.service';

@Component({
  selector: 'app-kubernetes-version-compare',
  templateUrl: './kubernetes-version-compare.component.html',
  styleUrls: ['./kubernetes-version-compare.component.less'],
})
export class KubernetesVersionCompareComponent implements OnInit {

  countryOptions: string[] = [];
  activeCountry = localStorage.getItem('k8s_version_compare_country') || '';
  comparisons: any[] = [];
  activeComparisonId: any = localStorage.getItem('k8s_version_compare_id') || '';

  result: any = null;
  loading = false;
  // Precomputed, stable-reference data for the table (avoid getters in template)
  filteredVersions: any[] = [];
  pagedVersions: any[] = [];
  pageIndex = 1;
  pageSize = 20;
  hasDrInfo = false;
  filterText = localStorage.getItem('k8s_version_compare_filter') || '';
  showDiffOnly = localStorage.getItem('k8s_version_compare_diff_only') === 'true';
  bothSidesOnly = localStorage.getItem('k8s_version_compare_both_sides') === 'true';
  ignoreDomain = (localStorage.getItem('k8s_version_compare_ignore_domain') ?? 'true') === 'true';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadComparisons();
  }

  loadComparisons() {
    this.apiService.get('/eds/instance/kubernetes', '/deployment/version/comparison/query', { countryCode: this.activeCountry })
      .subscribe(({ body }: any) => {
        this.comparisons = body || [];
        // extract unique country codes
        this.apiService.get('/eds/instance/kubernetes', '/deployment/version/comparison/query', {})
          .subscribe(({ body: all }: any) => {
            const codes = new Set((all || []).map((c: any) => c.countryCode).filter(Boolean));
            this.countryOptions = Array.from(codes) as string[];
          });
        // 不预选、不默认查询：由用户点击对比项后触发查询
        this.activeComparisonId = '';
      });
  }

  onCountryChange(country: any) {
    this.activeCountry = country;
    localStorage.setItem('k8s_version_compare_country', country || '');
    this.result = null;
    this.filteredVersions = [];
    this.pagedVersions = [];
    this.hasDrInfo = false;
    this.activeComparisonId = '';
    this.loadComparisons();
  }

  onComparisonChange(id: any) {
    this.activeComparisonId = id;
    localStorage.setItem('k8s_version_compare_id', id?.toString() || '');
    this.compare();
  }

  onFilterChange(text: string) {
    this.filterText = text || '';
    localStorage.setItem('k8s_version_compare_filter', this.filterText);
    this.applyFilter();
  }

  onIgnoreDomainChange(value: boolean) {
    this.ignoreDomain = value;
    localStorage.setItem('k8s_version_compare_ignore_domain', value ? 'true' : 'false');
    // match result depends on ignoreDomain -> recompute match then filter
    this.preprocess();
    this.applyFilter();
  }

  onDiffOnlyChange(value: boolean) {
    this.showDiffOnly = value;
    localStorage.setItem('k8s_version_compare_diff_only', value ? 'true' : 'false');
    this.applyFilter();
  }

  onBothSidesChange(value: boolean) {
    this.bothSidesOnly = value;
    localStorage.setItem('k8s_version_compare_both_sides', value ? 'true' : 'false');
    this.applyFilter();
  }

  compare() {
    if (!this.activeComparisonId) return;
    this.loading = true;
    this.apiService.get('/eds/instance/kubernetes', '/deployment/version/compare', { id: this.activeComparisonId })
      .subscribe(({ body }: any) => {
        this.result = body;
        this.preprocess();
        this.applyFilter();
        this.loading = false;
      }, () => {
        this.loading = false;
      });
  }

  /**
   * Precompute all derived display data ONCE when data (or ignoreDomain) changes,
   * so the template only reads plain properties instead of calling methods every
   * change-detection cycle.
   */
  private preprocess() {
    this.hasDrInfo = false;
    const apps = this.result?.applicationVersions || [];
    apps.forEach((app: any) => {
      (app.dcDeploymentImages || []).forEach((img: any) => this.decorateImage(img));
      (app.drDeploymentImages || []).forEach((img: any) => this.decorateImage(img));
      if (app.drDeploymentImages?.length > 0) {
        this.hasDrInfo = true;
      }
      app.$match = this.computeMatch(app);
    });
  }

  private decorateImage(img: any) {
    img.$tag = this.getImageTag(img.image);
    img.$replicasStyle = img.replicas === '0'
      ? '--devui-warning: var(--devui-line, #adb0b8)'
      : '--devui-warning: var(--devui-brand, #5e7ce0)';
    img.$hasResources = this.hasResources(img);
    img.$requests = this.getRequests(img);
    img.$limits = this.getLimits(img);
  }

  /** Build the filtered list into a stable-reference field (not a getter). */
  private applyFilter() {
    let list: any[] = this.result?.applicationVersions || [];
    if (this.bothSidesOnly) {
      list = list.filter((app: any) => app.dcDeploymentImages?.length > 0 && app.drDeploymentImages?.length > 0);
    }
    if (this.showDiffOnly) {
      list = list.filter((app: any) => !app.$match);
    }
    if (this.filterText) {
      const term = this.filterText.toLowerCase();
      list = list.filter((app: any) => app.appName?.toLowerCase().includes(term));
    }
    this.filteredVersions = list;
    this.pageIndex = 1;
    this.updatePaged();
  }

  /** Slice the filtered list to the current page — only these rows are rendered. */
  private updatePaged() {
    const start = (this.pageIndex - 1) * this.pageSize;
    this.pagedVersions = this.filteredVersions.slice(start, start + this.pageSize);
  }

  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.updatePaged();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.updatePaged();
  }

  trackByApp = (_: number, app: any) => app.appName;
  trackByImage = (_: number, img: any) => (img.name || '') + '|' + (img.image || '');

  private computeMatch(app: any): boolean {
    const dcImages = (app.dcDeploymentImages || []).filter((d: any) => !d.name?.includes('canary'));
    const drImages = (app.drDeploymentImages || []).filter((d: any) => !d.name?.includes('canary'));
    if (dcImages.length === 0 || drImages.length === 0) return false;
    const dcSet = new Set(dcImages.map((d: any) => this.normalizeImage(d.image)));
    const drSet = new Set(drImages.map((d: any) => this.normalizeImage(d.image)));
    if (dcSet.size !== drSet.size) return false;
    for (const img of dcSet) {
      if (!drSet.has(img)) return false;
    }
    return true;
  }

  /** When "ignore domain" is on, drop the registry host so only repo path + tag are compared. */
  private normalizeImage(image: string): string {
    if (!image) return '';
    if (!this.ignoreDomain) return image;
    const slash = image.indexOf('/');
    if (slash === -1) return image;
    const host = image.substring(0, slash);
    // A registry host contains a '.', a port ':' or is 'localhost'.
    if (host.includes('.') || host.includes(':') || host === 'localhost') {
      return image.substring(slash + 1);
    }
    return image;
  }

  getImageTag(image: string): string {
    if (!image) return '';
    const parts = image.split(':');
    return parts.length > 1 ? parts[parts.length - 1] : image;
  }

  /** Whether the image has any container resource config (requests/limits). */
  hasResources(img: any): boolean {
    const r = img?.containerResources;
    return !!(r && (r.limits?.cpu || r.limits?.memory || r.requests?.cpu || r.requests?.memory));
  }

  /** Format a resource map ({cpu:{amount,format}, memory:{amount,format}}) into "cpu Xm mem YMi". */
  private formatResources(res: any): string {
    if (!res) return '--';
    const parts: string[] = [];
    if (res.cpu) {
      parts.push('cpu ' + (res.cpu.amount ?? '') + (res.cpu.format ?? ''));
    }
    if (res.memory) {
      parts.push('mem ' + (res.memory.amount ?? '') + (res.memory.format ?? ''));
    }
    return parts.length ? parts.join(' ') : '--';
  }

  getLimits(img: any): string {
    return this.formatResources(img?.containerResources?.limits);
  }

  getRequests(img: any): string {
    return this.formatResources(img?.containerResources?.requests);
  }
}
