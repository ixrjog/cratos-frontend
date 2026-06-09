import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { ApiSecurityRiskComponent } from './api-security-risk/api-security-risk.component';
import { ApiSecurityRiskDataTableComponent } from './api-security-risk/api-security-risk-data-table/api-security-risk-data-table.component';
import { ApiSecurityRiskEditorComponent } from './api-security-risk/api-security-risk-data-table/api-security-risk-editor/api-security-risk-editor.component';
import { ApiSecurityRiskReportComponent } from './api-security-risk-report/api-security-risk-report.component';
import { ApiSecurityTestComponent } from './api-security-test/api-security-test.component';
import { ApiSecurityTestRecordComponent } from './api-security-test-record/api-security-test-record.component';
import { CredentialLeakComponent } from './credential-leak/credential-leak.component';
import { ApiScanComponent } from './api-scan/api-scan.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../@shared/shared.module';
import { DataTableModule } from 'ng-devui/data-table';
import { LoadingModule, PaginationModule } from 'ng-devui';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    SecurityComponent,
    ApiSecurityRiskComponent,
    ApiSecurityRiskDataTableComponent,
    ApiSecurityRiskEditorComponent,
    ApiSecurityRiskReportComponent,
    ApiSecurityTestComponent,
    ApiSecurityTestRecordComponent,
    CredentialLeakComponent,
    ApiScanComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SecurityRoutingModule,
    DaGridModule,
    TranslateModule,
    SharedModule,
    DataTableModule,
    LoadingModule,
    PaginationModule,
    MarkdownModule.forChild(),
  ],
})
export class SecurityModule {
}
