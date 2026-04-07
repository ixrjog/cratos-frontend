import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { ApiSecurityRiskComponent } from './api-security-risk/api-security-risk.component';

const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    children: [
      { path: 'api-risk', component: ApiSecurityRiskComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {
}
