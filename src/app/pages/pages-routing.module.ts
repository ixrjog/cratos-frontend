import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'getting-started',
        loadChildren: () => import('./getting-started/getting-started.module').then(m => m.GettingStartedModule),
      },
      {
        path: 'certificate',
        loadChildren: () => import('./certificate/certificate.module').then(m => m.CertificateModule),
      },
      {
        path: 'sys',
        loadChildren: () => import('./sys/sys.module').then(m => m.SysModule),
      },
      {
        path: 'channel',
        loadChildren: () => import('./channel/channel.module').then(m => m.ChannelModule),
      },
      {
        path: 'channel-network',
        loadChildren: () => import('./channel-network/channel-network.module').then(m => m.ChannelNetworkModule),
      },
      {
        path: 'risk-event',
        loadChildren: () => import('./risk-event/risk-event.module').then(m => m.RiskEventModule)
      },
      {
        path: 'traffic-layer',
        loadChildren: () => import('./traffic-layer/traffic-layer.module').then(m => m.TrafficLayerModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
      },
      {
        path: 'eds',
        loadChildren: () => import('./ext-datasource/ext-datasource.module').then(m => m.ExtDatasourceModule),
      },
      {
        path: 'rbac',
        loadChildren: () => import('./rbac/rbac.module').then(m => m.RbacModule),
      },
      {
        path: 'domain',
        loadChildren: () => import('./domain/domain.module').then(m => m.DomainModule),
      },
      {
        path: 'global-network',
        loadChildren: () => import('./global-network/global-network.module').then(m => m.GlobalNetworkModule),
      },
      {
        path: 'application',
        loadChildren: () => import('./application/application.module').then(m => m.ApplicationModule),
      },
      {
        path: 'workbench',
        loadChildren: () => import('./workbench/workbench.module').then(m => m.WorkbenchModule),
      },
      {
        path: 'finops',
        loadChildren: () => import('./finops/finops.module').then(m => m.FinopsModule),
      },
      {
        path: 'datacenter',
        loadChildren: () => import('./datacenter/datacenter.module').then(m => m.DatacenterModule),
      },
      {
        path: 'security',
        loadChildren: () => import('./security/security.module').then(m => m.SecurityModule),
      },
      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class PagesRoutingModule {
}
