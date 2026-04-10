import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { ApiSecurityRiskComponent } from './api-security-risk/api-security-risk.component';
import { ApiSecurityRiskDataTableComponent } from './api-security-risk/api-security-risk-data-table/api-security-risk-data-table.component';
import { ApiSecurityRiskEditorComponent } from './api-security-risk/api-security-risk-data-table/api-security-risk-editor/api-security-risk-editor.component';
import { ApiSecurityRiskReportComponent } from './api-security-risk-report/api-security-risk-report.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../@shared/shared.module';
import { DataTableModule } from 'ng-devui/data-table';
import { LoadingModule, PaginationModule } from 'ng-devui';

@NgModule({
  declarations: [
    SecurityComponent,
    ApiSecurityRiskComponent,
    ApiSecurityRiskDataTableComponent,
    ApiSecurityRiskEditorComponent,
    ApiSecurityRiskReportComponent,
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    DaGridModule,
    TranslateModule,
    SharedModule,
    DataTableModule,
    LoadingModule,
    PaginationModule,
  ],
})
export class SecurityModule {
}
