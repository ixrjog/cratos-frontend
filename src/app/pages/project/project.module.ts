import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { EaseidTenantViewComponent } from './easeid/tenant-view/easeid-tenant-view.component';
import { TmsTenantViewComponent } from './tms/tenant-view/tms-tenant-view.component';
import { ProjectConfigComponent } from './project-config/project-config.component';
import { ProjectConfigDataTableComponent } from './project-config/project-config-data-table/project-config-data-table.component';
import { ProjectConfigEditorComponent } from './project-config/project-config-data-table/project-config-editor/project-config-editor.component';
import { ProjectTenantComponent } from './project-tenant/project-tenant.component';
import { ProjectTenantDataTableComponent } from './project-tenant/project-tenant-data-table/project-tenant-data-table.component';
import { ProjectTenantEditorComponent } from './project-tenant/project-tenant-data-table/project-tenant-editor/project-tenant-editor.component';
import { TabsModule, TagsModule, SplitterModule, CardModule, IconModule, LoadingModule, PaginationModule } from 'ng-devui';
import { DataTableModule } from 'ng-devui/data-table';
import { DCommonModule } from 'ng-devui/common';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from '../../@shared/shared.module';
import { DaGridModule } from '../../@shared/layouts/da-grid';

@NgModule({
  declarations: [
    ProjectComponent,
    EaseidTenantViewComponent,
    TmsTenantViewComponent,
    ProjectConfigComponent,
    ProjectConfigDataTableComponent,
    ProjectConfigEditorComponent,
    ProjectTenantComponent,
    ProjectTenantDataTableComponent,
    ProjectTenantEditorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProjectRoutingModule,
    TabsModule,
    TagsModule,
    SplitterModule,
    CardModule,
    IconModule,
    LoadingModule,
    PaginationModule,
    DataTableModule,
    DCommonModule,
    SharedModule,
    DaGridModule,
    MarkdownModule.forChild(),
  ],
})
export class ProjectModule {
}
