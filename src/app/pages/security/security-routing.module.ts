import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { ApiSecurityRiskComponent } from './api-security-risk/api-security-risk.component';
import { ApiSecurityRiskReportComponent } from './api-security-risk-report/api-security-risk-report.component';
import { ApiSecurityTestComponent } from './api-security-test/api-security-test.component';
import { ApiSecurityTestRecordComponent } from './api-security-test-record/api-security-test-record.component';

const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    children: [
      { path: 'api-risk', component: ApiSecurityRiskComponent },
      { path: 'api-risk-report', component: ApiSecurityRiskReportComponent },
      { path: 'api-test', component: ApiSecurityTestComponent },
      { path: 'api-test-record', component: ApiSecurityTestRecordComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {
}
