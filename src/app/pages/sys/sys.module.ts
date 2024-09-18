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
import {
  CredentialEditorComponent,
} from './credential/credential-data-table/credential-editor/credential-editor.component';
import { EnvComponent } from './env/env.component';
import { EnvDataTableComponent } from './env/env-data-table/env-data-table.component';
import { EnvEditorComponent } from './env/env-data-table/env-editor/env-editor.component';
import { MenuComponent } from './menu/menu.component';
import { MenuConfigComponent } from './menu/menu-config/menu-config.component';
import { ServerAccountComponent } from './server-account/server-account.component';
import {
  ServerAccountDataTableComponent,
} from './server-account/server-account-data-table/server-account-data-table.component';
import {
  ServerAccountEditorComponent,
} from './server-account/server-account-data-table/server-account-editor/server-account-editor.component';
import { SshSessionComponent } from './ssh-session/ssh-session.component';
import { SshSessionDataTableComponent } from './ssh-session/ssh-session-data-table/ssh-session-data-table.component';
import {
  SshSessionInstanceCommandComponent,
} from './ssh-session/ssh-session-data-table/ssh-session-instance-command/ssh-session-instance-command.component';
import { NotificationTemplateComponent } from './notification-template/notification-template.component';
import {
  NotificationTemplateDataTableComponent,
} from './notification-template/notification-template-data-table/notification-template-data-table.component';
import {
  NotificationTemplateEditorComponent,
} from './notification-template/notification-template-data-table/notification-template-editor/notification-template-editor.component';
import { AssetMaturityComponent } from './asset-maturity/asset-maturity.component';
import {
  AssetMaturityDataTableComponent,
} from './asset-maturity/asset-maturity-data-table/asset-maturity-data-table.component';
import {
  AssetMaturityEditorComponent,
} from './asset-maturity/asset-maturity-data-table/asset-maturity-editor/asset-maturity-editor.component';
import { RobotComponent } from './robot/robot.component';
import { RobotDataTableComponent } from './robot/robot-data-table/robot-data-table.component';
import { RobotEditorComponent } from './robot/robot-data-table/robot-editor/robot-editor.component';
import { MarkdownModule } from 'ngx-markdown';


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
    MenuComponent,
    MenuConfigComponent,
    ServerAccountComponent,
    ServerAccountDataTableComponent,
    ServerAccountEditorComponent,
    SshSessionComponent,
    SshSessionDataTableComponent,
    SshSessionInstanceCommandComponent,
    NotificationTemplateComponent,
    NotificationTemplateDataTableComponent,
    NotificationTemplateEditorComponent,
    AssetMaturityComponent,
    AssetMaturityDataTableComponent,
    AssetMaturityEditorComponent,
    RobotComponent,
    RobotDataTableComponent,
    RobotEditorComponent,
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
    MarkdownModule,
  ],
})
export class SysModule { }
