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
        if (this.activeComparisonId && this.comparisons.some(c => c.id == this.activeComparisonId)) {
          this.compare();
        } else if (this.comparisons.length > 0) {
          this.activeComparisonId = this.comparisons[0].id;
          this.compare();
        }
      });
  }

  onCountryChange(country: any) {
    this.activeCountry = country;
    localStorage.setItem('k8s_version_compare_country', country || '');
    this.result = null;
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
  }

  onIgnoreDomainChange(value: boolean) {
    this.ignoreDomain = value;
    localStorage.setItem('k8s_version_compare_ignore_domain', value ? 'true' : 'false');
  }

  onDiffOnlyChange(value: boolean) {
    this.showDiffOnly = value;
    localStorage.setItem('k8s_version_compare_diff_only', value ? 'true' : 'false');
  }

  onBothSidesChange(value: boolean) {
    this.bothSidesOnly = value;
    localStorage.setItem('k8s_version_compare_both_sides', value ? 'true' : 'false');
  }

  compare() {
    if (!this.activeComparisonId) return;
    this.loading = true;
    this.apiService.get('/eds/instance/kubernetes', '/deployment/version/compare', { id: this.activeComparisonId })
      .subscribe(({ body }: any) => {
        this.result = body;
        this.loading = false;
      });
  }

  get filteredVersions() {
    if (!this.result?.applicationVersions) return [];
    let list = this.result.applicationVersions;
    if (this.bothSidesOnly) {
      list = list.filter((app: any) => app.dcDeploymentImages?.length > 0 && app.drDeploymentImages?.length > 0);
    }
    if (this.showDiffOnly) {
      list = list.filter((app: any) => !this.isVersionMatch(app));
    }
    if (this.filterText) {
      const term = this.filterText.toLowerCase();
      list = list.filter((app: any) => app.appName?.toLowerCase().includes(term));
    }
    return list;
  }

  isVersionMatch(app: any): boolean {
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
}
