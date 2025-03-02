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
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class PagesRoutingModule {
}
