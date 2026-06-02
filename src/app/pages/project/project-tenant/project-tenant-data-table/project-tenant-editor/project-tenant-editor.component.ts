import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui/form';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ProjectService } from '../../../../../@core/services/project.service';
import { EdsService } from '../../../../../@core/services/ext-datasource.service.s';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-project-tenant-editor',
  templateUrl: './project-tenant-editor.component.html',
  styleUrls: ['./project-tenant-editor.component.less'],
})
export class ProjectTenantEditorComponent implements OnInit {

  @ViewChild('editorForm') formDir: DFormGroupRuleDirective;
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: any;
  formGroup: FormGroup;
  operationType: boolean;
  selectedProject: any;
  editorTab = 'basic';

  loadBalancers: any[] = [];
  editingLb: any = null;
  // LB add flow
  instanceTypeOptions: any[] = [];
  lbTypeOptions: any[] = [];
  filteredLbTypeOptions: any[] = [];
  selectedInstanceType = '';
  selectedLbType = '';
  selectedInstance: any = null;
  selectedAsset: any = null;
  newLbConfig = '';

  onSearchProject = (term: string) => {
    return this.projectService.queryProjectPage({ queryName: term, page: 1, length: 10 })
      .pipe(
        map(({ body }) => body.data.map((p, index) => ({ id: index, option: p }))),
      );
  };

  onSearchInstance = (term: string) => {
    if (!this.selectedInstanceType) return of([]);
    return this.edsService.queryEdsInstancePage({
      queryName: term,
      edsType: this.selectedInstanceType,
      page: 1,
      length: 10,
    }).pipe(
      map(({ body }) => body.data.map((inst, index) => ({ id: index, option: inst }))),
    );
  };

  onSearchAsset = (term: string) => {
    if (!this.selectedInstanceType || !this.selectedLbType) return of([]);
    return this.edsService.queryEdsInstanceAssetPage({
      queryName: term,
      assetType: this.selectedLbType,
      instanceId: this.selectedInstance?.id,
      valid: true,
      page: 1,
      length: 10,
    } as any).pipe(
      map(({ body }) => body.data.map((a, index) => ({ id: index, option: a }))),
    );
  };

  constructor(private projectService: ProjectService, private edsService: EdsService) {}

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.formGroup = new UntypedFormGroup({
      projectId: new UntypedFormControl(this.formData.projectId),
      tenantCode: new UntypedFormControl(this.formData.tenantCode),
      countryCode: new UntypedFormControl(this.formData.countryCode),
      name: new UntypedFormControl(this.formData.name),
      docs: new UntypedFormControl(this.formData.docs),
      valid: new UntypedFormControl(this.formData.valid),
      comment: new UntypedFormControl(this.formData.comment),
    });
    if (this.formData.project) {
      this.selectedProject = this.formData.project;
    }
    if (this.formData.id) {
      this.fetchLoadBalancers();
    }
    this.loadOptions();
  }

  loadOptions() {
    this.edsService.getEdsInstanceTypeDatacenterOptions()
      .subscribe(({ body }) => {
        this.instanceTypeOptions = body.options || [];
      });
    this.projectService.getLbTypeOptions()
      .subscribe(({ body }) => {
        this.lbTypeOptions = body.options || [];
      });
  }

  onInstanceTypeChange(type: any) {
    this.selectedInstanceType = type;
    this.filteredLbTypeOptions = this.lbTypeOptions.filter(t => {
      const val = (typeof t === 'string' ? t : t?.value || '').toLowerCase();
      return val.startsWith(type.toLowerCase());
    });
    this.selectedLbType = '';
    this.selectedInstance = null;
    this.selectedAsset = null;
  }

  onLbTypeChange(type: any) {
    this.selectedLbType = typeof type === 'string' ? type : type?.value || '';
    this.selectedAsset = null;
  }

  onInstanceChange(instance: any) {
    this.selectedInstance = instance;
    this.selectedAsset = null;
  }

  onAssetChange(asset: any) {
    this.selectedAsset = asset;
  }

  fetchLoadBalancers() {
    this.projectService.queryLoadBalancersByTenantId(this.formData.id)
      .subscribe(({ body }) => {
        this.loadBalancers = body;
      });
  }

  onProjectChange(project: any) {
    this.formGroup.patchValue({ projectId: project?.id });
  }

  onAddLb() {
    if (!this.selectedAsset) return;
    const lb = {
      projectId: this.formGroup.value.projectId,
      tenantId: this.formData.id,
      assetId: this.selectedAsset.id,
      instanceId: this.selectedInstance?.id,
      name: this.selectedAsset.name,
      valid: true,
      config: this.newLbConfig,
    };
    this.projectService.addProjectLoadBalancer(lb).subscribe(() => {
      this.selectedAsset = null;
      this.newLbConfig = '';
      this.fetchLoadBalancers();
    });
  }

  onDeleteLb(lb: any) {
    if (lb.id) {
      this.projectService.deleteProjectLoadBalancer({ id: lb.id }).subscribe(() => {
        this.editingLb = null;
        this.fetchLoadBalancers();
      });
    }
  }

  onEditLb(lb: any) {
    this.editingLb = JSON.parse(JSON.stringify(lb));
  }

  onSaveLbConfig() {
    if (!this.editingLb?.id) return;
    this.projectService.updateProjectLoadBalancer({
      id: this.editingLb.id,
      config: this.editingLb.config,
    }).subscribe(() => {
      this.editingLb = null;
      this.fetchLoadBalancers();
    });
  }

  addForm() {
    return this.projectService.addProjectTenant(this.formGroup.value);
  }

  updateForm() {
    return this.projectService.updateProjectTenant({ ...this.formGroup.value, id: this.formData.id });
  }
}
