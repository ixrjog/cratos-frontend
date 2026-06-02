import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ProjectPageQuery, ProjectTenantVO, ProjectVO, ProjectService } from '../../../../@core/services/project.service';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { ProjectTenantEditorComponent } from './project-tenant-editor/project-tenant-editor.component';

@Component({
  selector: 'app-project-tenant-data-table',
  templateUrl: './project-tenant-data-table.component.html',
  styleUrls: ['./project-tenant-data-table.component.less'],
})
export class ProjectTenantDataTableComponent implements OnInit {

  protected readonly limit = RELATIVE_TIME_LIMIT;
  protected readonly getRowColor = getRowColor;

  private static readonly STORAGE_KEY = 'project_tenant_search';

  projects: { id: number, key: string, count?: number }[] = [];
  activeProjectId: any = localStorage.getItem('project_tenant_active_project') || '';

  queryParam = { queryName: localStorage.getItem('project_tenant_search') || '' };

  table: Table<ProjectTenantVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    editorData: { ...DIALOG_DATA.editorData, width: '50%', content: ProjectTenantEditorComponent },
  };

  newTenant = { projectId: null, tenantCode: '', countryCode: '', name: '', docs: '', valid: true, comment: '' };

  constructor(private projectService: ProjectService, private dialogUtil: DialogUtil, private toastUtil: ToastUtil) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.queryProjectPage({ queryName: '', page: 1, length: 100 })
      .subscribe(({ body }) => {
        this.projects = body.data.map(p => ({ ...p, count: 0 }));
        this.fetchData();
        // load counts
        this.projectService.queryProjectTenantPage({ queryName: '', page: 1, length: 1000 } as any)
          .subscribe(({ body: tenantBody }) => {
            const countMap = {};
            tenantBody.data.forEach(t => {
              countMap[t.projectId] = (countMap[t.projectId] || 0) + 1;
            });
            this.projects.forEach(p => p.count = countMap[p.id] || 0);
          });
      });
  }

  onProjectChange(projectId: any) {
    this.activeProjectId = projectId;
    localStorage.setItem('project_tenant_active_project', projectId?.toString() || '');
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  fetchData() {
    localStorage.setItem('project_tenant_search', this.queryParam.queryName);
    const param: any = {
      ...this.queryParam,
      projectId: this.activeProjectId || null,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.projectService.queryProjectTenantPage(param));
  }

  pageIndexChange(pageIndex) { this.table.pager.pageIndex = pageIndex; this.fetchData(); }
  pageSizeChange(pageSize) { this.table.pager.pageSize = pageSize; this.fetchData(); }

  onRowNew() {
    const data = { ...this.newTenant, projectId: this.activeProjectId || null };
    this.dialogUtil.onEditDialog(ADD_OPERATION, { ...this.dialogDate.editorData, title: 'New Tenant' }, () => this.fetchData(), JSON.parse(JSON.stringify(data)));
  }

  onRowEdit(rowItem: ProjectTenantVO) {
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, { ...this.dialogDate.editorData, title: 'Edit Tenant' }, () => this.fetchData(), JSON.parse(JSON.stringify(rowItem)));
  }

  onRowDelete(rowItem: ProjectTenantVO) {
    this.dialogUtil.onDialog({ ...DIALOG_DATA.warningOperateData, content: '<strong>Confirm delete this tenant?</strong>' }, () => {
      this.projectService.deleteProjectTenant({ id: rowItem.id }).subscribe(() => { this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE); this.fetchData(); });
    });
  }
}
