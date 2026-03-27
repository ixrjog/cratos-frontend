import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificateComponent } from './certificate.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateDeploymentComponent } from './certificate-deployment/certificate-deployment.component';
import { AcmeDomainComponent } from './acme-domain/acme-domain.component';

const routes: Routes = [
  {
    path: '',
    component: CertificateComponent,
    children: [
      { path: 'list', component: CertificateListComponent },
      { path: 'deployment', component: CertificateDeploymentComponent },
      { path: 'acme/domain', component: AcmeDomainComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class CertificateRoutingModule {
}
