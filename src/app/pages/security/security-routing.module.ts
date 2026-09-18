import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { ApiSecurityRiskComponent } from './api-security-risk/api-security-risk.component';
import { ApiSecurityRiskReportComponent } from './api-security-risk-report/api-security-risk-report.component';
import { ApiSecurityTestComponent } from './api-security-test/api-security-test.component';
import { ApiSecurityTestRecordComponent } from './api-security-test-record/api-security-test-record.component';
import { CredentialLeakComponent } from './credential-leak/credential-leak.component';
import { ApiScanComponent } from './api-scan/api-scan.component';
import { ScaComponent } from './sca/sca.component';
import { SastComponent } from './sast/sast.component';
import { LogLintComponent } from './log-lint/log-lint.component';
import { SecurityIncidentComponent } from './security-incident/security-incident.component';

const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    children: [
      { path: 'api-risk', component: ApiSecurityRiskComponent },
      { path: 'api-risk-report', component: ApiSecurityRiskReportComponent },
      { path: 'api-test', component: ApiSecurityTestComponent },
      { path: 'api-test-record', component: ApiSecurityTestRecordComponent },
      { path: 'credential-leak', component: CredentialLeakComponent },
      { path: 'api-scan', component: ApiScanComponent },
      { path: 'sca', component: ScaComponent },
      { path: 'sast', component: SastComponent },
      { path: 'loglint', component: LogLintComponent },
      { path: 'incident', component: SecurityIncidentComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {
}
