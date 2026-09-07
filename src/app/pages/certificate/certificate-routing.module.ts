import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificateComponent } from './certificate.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateDeploymentComponent } from './certificate-deployment/certificate-deployment.component';
import { AcmeDomainComponent } from './acme-domain/acme-domain.component';
import { AcmeOrderComponent } from './acme-order/acme-order.component';
import { AcmeAccountComponent } from './acme-account/acme-account.component';
import { DcvAcmeDomainComponent } from './dcv-acme-domain/dcv-acme-domain.component';
import { AcmeReconciliationComponent } from './acme-reconciliation/acme-reconciliation.component';

const routes: Routes = [
  {
    path: '',
    component: CertificateComponent,
    children: [
      { path: 'list', component: CertificateListComponent },
      { path: 'deployment', component: CertificateDeploymentComponent },
      { path: 'acme/domain', component: AcmeDomainComponent },
      { path: 'acme/order', component: AcmeOrderComponent },
      { path: 'acme/account', component: AcmeAccountComponent },
      { path: 'acme/reconciliation', component: AcmeReconciliationComponent },
      { path: 'dcv/acme/domain', component: DcvAcmeDomainComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class CertificateRoutingModule {
}
