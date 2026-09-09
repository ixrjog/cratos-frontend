import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfraInfoService } from '../../../@core/services/infra-info.service';
import { InfraInfoEdit, InfraInfoVO } from '../../../@core/data/infra-info';
import { ToastUtil } from '../../../@shared/utils/toast.util';

@Component({
  selector: 'app-infra-info',
  templateUrl: './infra-info.component.html',
  styleUrls: ['./infra-info.component.less'],
})
export class InfraInfoComponent implements OnInit {

  // Country tabs
  countryOptions: string[] = [];
  selectedCountry = '';

  // All data
  allList: InfraInfoVO[] = [];
  filteredList: InfraInfoVO[] = [];
  // Aggregated project names (left sidebar)
  projectList: { project: string; country: string }[] = [];
  selectedProject = '';
  // Env items under the selected project (right-side tabs)
  envList: InfraInfoVO[] = [];
  selectedItem: InfraInfoVO = null;
  loading = false;

  // Edit dialog
  editVisible = false;
  editSaving = false;
  editData: InfraInfoEdit = this.emptyEdit();

  constructor(private infraInfoService: InfraInfoService,
              private route: ActivatedRoute,
              private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.fetchAll();
  }

  private fetchAll() {
    this.loading = true;
    this.infraInfoService.queryInfraInfoPage({ page: 1, length: 1000 })
      .subscribe(({ body }) => {
        this.allList = body.data || [];
        const countries = new Set<string>();
        this.allList.forEach(item => { if (item.country) countries.add(item.country); });
        this.countryOptions = Array.from(countries).sort();
        this.filterList();
        this.applyInitialSelection();
        this.loading = false;
      }, () => {
        this.loading = false;
      });
  }

  private static readonly STORAGE_KEY = 'infra_info_selection';

  /** 初始选择: URL ?id= 优先(分享直达), 否则恢复上次持久化的选择 */
  private applyInitialSelection() {
    const idParam = this.route.snapshot.queryParams['id'];
    if (idParam) {
      this.applyRouteId(+idParam);
      return;
    }
    this.restoreSelection();
  }

  /** URL 参数 ?id= 直达具体基础设施详情: 反推 country/project 三级选中 */
  private applyRouteId(id: number) {
    const target = this.allList.find(i => i.id === id);
    if (!target) {
      return;
    }
    this.selectedCountry = target.country || '';
    this.filterList();
    if (target.project) {
      this.onSelectProject(target.project);
    }
    this.selectedItem = this.envList.find(i => i.id === id) || target;
  }

  /** 恢复上次选择(国家/项目/环境), 逐级校验仍存在 */
  private restoreSelection() {
    let saved: { country?: string; project?: string; id?: number };
    try {
      const raw = localStorage.getItem(InfraInfoComponent.STORAGE_KEY);
      if (!raw) {
        return;
      }
      saved = JSON.parse(raw);
    } catch (e) {
      return;
    }
    if (!saved) {
      return;
    }
    // 恢复国家(需在选项中)
    if (saved.country && this.countryOptions.includes(saved.country)) {
      this.selectedCountry = saved.country;
      this.filterList();
    }
    // 恢复项目
    if (saved.project && this.projectList.some(p => p.project === saved.project)) {
      this.onSelectProject(saved.project);
      // 恢复环境
      if (saved.id) {
        const env = this.envList.find(i => i.id === saved.id);
        if (env) {
          this.selectedItem = env;
        }
      }
    }
    this.persistSelection();
  }

  /** 保存当前选择 */
  private persistSelection() {
    try {
      localStorage.setItem(InfraInfoComponent.STORAGE_KEY, JSON.stringify({
        country: this.selectedCountry,
        project: this.selectedProject,
        id: this.selectedItem ? this.selectedItem.id : null,
      }));
    } catch (e) {
      // 忽略 localStorage 异常
    }
  }

  /** 复制指向当前详情的分享链接 */
  onShareCopy() {
    if (!this.selectedItem) {
      return;
    }
    const url = `${window.location.origin}/#/pages/infra/info?id=${this.selectedItem.id}`;
    const done = () => this.toastUtil.onSuccessToast('分享链接已复制');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => this.fallbackCopy(url, done));
    } else {
      this.fallbackCopy(url, done);
    }
  }

  private fallbackCopy(text: string, done: () => void) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) {
      // 忽略复制失败
    }
  }

  onCountryChange(country: string) {
    this.selectedCountry = country;
    this.selectedProject = '';
    this.selectedItem = null;
    this.envList = [];
    this.filterList();
    this.persistSelection();
  }

  private filterList() {
    this.filteredList = this.selectedCountry
      ? this.allList.filter(item => item.country === this.selectedCountry)
      : this.allList;
    // Aggregate unique project names with their country code(s)
    const projectCountryMap = new Map<string, Set<string>>();
    this.filteredList.forEach(item => {
      if (!item.project) return;
      if (!projectCountryMap.has(item.project)) {
        projectCountryMap.set(item.project, new Set<string>());
      }
      if (item.country) {
        projectCountryMap.get(item.project).add(item.country);
      }
    });
    this.projectList = Array.from(projectCountryMap.entries())
      .map(([project, countries]) => ({ project, country: Array.from(countries).sort().join(', ') }))
      .sort((a, b) => a.project.localeCompare(b.project));
    // Keep current project selection if still valid, otherwise reset
    if (this.selectedProject && this.projectList.some(p => p.project === this.selectedProject)) {
      this.onSelectProject(this.selectedProject);
    } else {
      this.selectedProject = '';
      this.envList = [];
      this.selectedItem = null;
    }
  }

  onSelectProject(project: string) {
    this.selectedProject = project;
    this.envList = this.filteredList.filter(item => item.project === project);
    // keep current env if it still belongs to this project, else pick first
    const keep = this.selectedItem && this.envList.find(i => i.id === this.selectedItem.id);
    this.selectedItem = keep || this.envList[0] || null;
    this.persistSelection();
  }

  onEnvChange(id: any) {
    this.selectedItem = this.envList.find(item => item.id === +id) || null;
    this.persistSelection();
  }

  // ---------- Edit ----------

  onEdit() {
    if (!this.selectedItem) return;
    this.editData = {
      id: this.selectedItem.id,
      name: this.selectedItem.name || '',
      project: this.selectedItem.project || '',
      envName: this.selectedItem.envName || '',
      country: this.selectedItem.country || '',
      doc: this.selectedItem.doc || '',
      comment: this.selectedItem.comment || '',
    };
    this.editVisible = true;
  }

  onSaveEdit() {
    this.editSaving = true;
    this.infraInfoService.updateInfraInfo(this.editData).subscribe(() => {
      this.editSaving = false;
      this.editVisible = false;
      // Refresh data and re-select the updated item
      const updatedId = this.editData.id;
      this.infraInfoService.queryInfraInfoPage({ page: 1, length: 1000 })
        .subscribe(({ body }) => {
          this.allList = body.data || [];
          const countries = new Set<string>();
          this.allList.forEach(item => { if (item.country) countries.add(item.country); });
          this.countryOptions = Array.from(countries).sort();
          const updated = this.allList.find(i => i.id === updatedId);
          this.filterList();
          if (updated) {
            this.onSelectProject(updated.project);
            this.selectedItem = this.envList.find(i => i.id === updatedId) || this.selectedItem;
          }
        });
    }, () => {
      this.editSaving = false;
    });
  }

  private emptyEdit(): InfraInfoEdit {
    return { id: 0, name: '', project: '', envName: '', country: '', doc: '', comment: '' };
  }

}
