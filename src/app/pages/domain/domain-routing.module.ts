import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DomainListComponent } from './domain-list/domain-list.component';
import { CertificateComponent } from '../certificate/certificate.component';

const routes: Routes = [
  {
    path: '',
    component: CertificateComponent,
    children: [
      { path: 'list', component: DomainListComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class DomainRoutingModule {
}
