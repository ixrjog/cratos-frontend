import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificateComponent } from './certificate.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';

const routes: Routes = [
  {
    path: '',
    component: CertificateComponent,
    children: [
      { path: 'manage', component: CertificateListComponent }
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class CertificateRoutingModule {
}
