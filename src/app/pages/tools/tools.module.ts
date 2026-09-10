import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule, IconModule, SelectModule } from 'ng-devui';
import { ToolsRoutingModule } from './tools-routing.module';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { SharedModule } from '../../@shared/shared.module';
import { ToolsComponent } from './tools.component';
import { JsonFormatterComponent } from './json-formatter/json-formatter.component';
import { Base64ToolComponent } from './base64-tool/base64-tool.component';
import { SshKeygenComponent } from './ssh-keygen/ssh-keygen.component';
import { PasswordGenComponent } from './password-gen/password-gen.component';
import { HashToolComponent } from './hash-tool/hash-tool.component';
import { WorldClockComponent } from './world-clock/world-clock.component';
import { IpCalcComponent } from './ip-calc/ip-calc.component';

@NgModule({
  declarations: [
    ToolsComponent,
    JsonFormatterComponent,
    Base64ToolComponent,
    SshKeygenComponent,
    PasswordGenComponent,
    HashToolComponent,
    WorldClockComponent,
    IpCalcComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ToolsRoutingModule,
    DaGridModule,
    ButtonModule,
    IconModule,
    SelectModule,
    SharedModule,
  ],
})
export class ToolsModule {
}
