import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SysRoutingModule } from './sys-routing.module';
import { SysComponent } from './sys.component';
import { TagComponent } from './tag/tag.component';
import { CredentialComponent } from './credential/credential.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { TagDataTableComponent } from './tag/tag-data-table/tag-data-table.component';
import { ButtonModule, DataTableModule, LoadingModule, PaginationModule } from 'ng-devui';
import { I18nModule } from 'ng-devui/i18n';
import { ReactiveFormsModule } from '@angular/forms';
import { BasicFormModule } from '../getting-started/sample/basic-form/basic-form.module';
import { SharedModule } from '../../@shared/shared.module';
import { CredentialDataTableComponent } from './credential/credential-data-table/credential-data-table.component';
import { TagEditorComponent } from './tag/tag-data-table/tag-editor/tag-editor.component';
import { CredentialEditorComponent } from './credential/credential-data-table/credential-editor/credential-editor.component';
import { EnvComponent } from './env/env.component';
import { EnvDataTableComponent } from './env/env-data-table/env-data-table.component';
import { EnvEditorComponent } from './env/env-data-table/env-editor/env-editor.component';


@NgModule({
  declarations: [
    SysComponent,
    TagComponent,
    CredentialComponent,
    TagDataTableComponent,
    CredentialDataTableComponent,
    TagEditorComponent,
    CredentialEditorComponent,
    EnvComponent,
    EnvDataTableComponent,
    EnvEditorComponent,
  ],
  imports: [
    CommonModule,
    SysRoutingModule,
    DaGridModule,
    ButtonModule,
    DataTableModule,
    I18nModule,
    LoadingModule,
    PaginationModule,
    ReactiveFormsModule,
    BasicFormModule,
    SharedModule,
  ],
})
export class SysModule { }
