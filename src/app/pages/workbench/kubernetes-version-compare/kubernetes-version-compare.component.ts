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
  filterText = '';
  showDiffOnly = false;

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
    const dcSet = new Set(dcImages.map((d: any) => d.image));
    const drSet = new Set(drImages.map((d: any) => d.image));
    if (dcSet.size !== drSet.size) return false;
    for (const img of dcSet) {
      if (!drSet.has(img)) return false;
    }
    return true;
  }

  getImageTag(image: string): string {
    if (!image) return '';
    const parts = image.split(':');
    return parts.length > 1 ? parts[parts.length - 1] : image;
  }
}
