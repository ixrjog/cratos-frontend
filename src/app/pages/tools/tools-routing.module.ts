import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolsComponent } from './tools.component';
import { JsonFormatterComponent } from './json-formatter/json-formatter.component';
import { Base64ToolComponent } from './base64-tool/base64-tool.component';
import { SshKeygenComponent } from './ssh-keygen/ssh-keygen.component';
import { PasswordGenComponent } from './password-gen/password-gen.component';
import { HashToolComponent } from './hash-tool/hash-tool.component';
import { WorldClockComponent } from './world-clock/world-clock.component';

const routes: Routes = [
  {
    path: '',
    component: ToolsComponent,
  },
  {
    path: 'json',
    component: JsonFormatterComponent,
  },
  {
    path: 'base64',
    component: Base64ToolComponent,
  },
  {
    path: 'ssh-keygen',
    component: SshKeygenComponent,
  },
  {
    path: 'password',
    component: PasswordGenComponent,
  },
  {
    path: 'hash',
    component: HashToolComponent,
  },
  {
    path: 'world-clock',
    component: WorldClockComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ToolsRoutingModule {
}
