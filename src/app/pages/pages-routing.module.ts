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
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class PagesRoutingModule {
}
