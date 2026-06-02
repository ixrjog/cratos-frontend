import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import { EaseidTenantViewComponent } from './easeid/tenant-view/easeid-tenant-view.component';
import { TmsTenantViewComponent } from './tms/tenant-view/tms-tenant-view.component';
import { ProjectConfigComponent } from './project-config/project-config.component';
import { ProjectTenantComponent } from './project-tenant/project-tenant.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      { path: 'easeid/tenant-view', component: EaseidTenantViewComponent },
      { path: 'tms/tenant-view', component: TmsTenantViewComponent },
      { path: 'list', component: ProjectConfigComponent },
      { path: 'tenant', component: ProjectTenantComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {
}
