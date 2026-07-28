import { Component, OnInit } from '@angular/core';
import { InfraInfoService } from '../../../@core/services/infra-info.service';
import { InfraInfoEdit, InfraInfoVO } from '../../../@core/data/infra-info';

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

  constructor(private infraInfoService: InfraInfoService) {
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
        this.loading = false;
      }, () => {
        this.loading = false;
      });
  }

  onCountryChange(country: string) {
    this.selectedCountry = country;
    this.selectedProject = '';
    this.selectedItem = null;
    this.envList = [];
    this.filterList();
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
  }

  onEnvChange(id: any) {
    this.selectedItem = this.envList.find(item => item.id === +id) || null;
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
