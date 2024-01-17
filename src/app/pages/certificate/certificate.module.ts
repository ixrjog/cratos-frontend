import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificateRoutingModule } from './certificate-routing.module';
import { CertificateComponent } from './certificate.component';
import { CertificateManageComponent } from './certificate-manage/certificate-manage.component';
import { BreadcrumbModule, LoadingModule, PaginationModule } from 'ng-devui';
import { DataTableModule } from 'ng-devui/data-table';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../@shared/shared.module';
import { CertificateManageDataTableComponent } from './certificate-manage/certificate-manage-data-table/certificate-manage-data-table.component';
import { BasicFormModule } from '../getting-started/sample/basic-form/basic-form.module';


@NgModule({
  declarations: [
    CertificateComponent,
    CertificateManageComponent,
    CertificateManageDataTableComponent
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
  ],
})
export class CertificateModule { }
