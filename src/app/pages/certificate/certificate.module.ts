import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificateRoutingModule } from './certificate-routing.module';
import { CertificateComponent } from './certificate.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { BreadcrumbModule, LoadingModule, PaginationModule } from 'ng-devui';
import { MarkdownModule } from 'ngx-markdown';
import { DataTableModule } from 'ng-devui/data-table';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../@shared/shared.module';
import {
  CertificateListDataTableComponent,
} from './certificate-list/certificate-list-data-table/certificate-list-data-table.component';
import { BasicFormModule } from '../getting-started/sample/basic-form/basic-form.module';
import {
  CertificateEditorComponent,
} from './certificate-list/certificate-list-data-table/certificate-editor/certificate-editor.component';
import { CertificateDeploymentComponent } from './certificate-deployment/certificate-deployment.component';
import {
  CertificateDeploymentDetailComponent
} from './certificate-deployment/certificate-deployment-detail/certificate-deployment-detail.component';
import { AcmeDomainComponent } from './acme-domain/acme-domain.component';
import {
  AcmeDomainDataTableComponent
} from './acme-domain/acme-domain-data-table/acme-domain-data-table.component';
import {
  AcmeDomainEditorComponent
} from './acme-domain/acme-domain-data-table/acme-domain-editor/acme-domain-editor.component';
import {
  AcmeDomainIssueConfirmComponent
} from './acme-domain/acme-domain-data-table/acme-domain-issue-confirm/acme-domain-issue-confirm.component';
import { AcmeOrderComponent } from './acme-order/acme-order.component';
import {
  AcmeOrderDataTableComponent
} from './acme-order/acme-order-data-table/acme-order-data-table.component';
import { AcmeAccountComponent } from './acme-account/acme-account.component';
import {
  AcmeAccountDataTableComponent
} from './acme-account/acme-account-data-table/acme-account-data-table.component';


@NgModule({
  declarations: [
    CertificateComponent,
    CertificateListComponent,
    CertificateListDataTableComponent,
    CertificateEditorComponent,
    CertificateDeploymentComponent,
    CertificateDeploymentDetailComponent,
    AcmeDomainComponent,
    AcmeDomainDataTableComponent,
    AcmeDomainEditorComponent,
    AcmeDomainIssueConfirmComponent,
    AcmeOrderComponent,
    AcmeOrderDataTableComponent,
    AcmeAccountComponent,
    AcmeAccountDataTableComponent,
  ],
  imports: [
    CommonModule,
    CertificateRoutingModule,
    BreadcrumbModule,
    DaGridModule,
    TranslateModule,
    SharedModule,
    DataTableModule,
    LoadingModule,
    BasicFormModule,
    PaginationModule,
    MarkdownModule,
  ],
  providers: [
  ]
})
export class CertificateModule { }
