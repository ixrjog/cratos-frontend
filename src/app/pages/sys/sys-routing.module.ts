import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysComponent } from './sys.component';
import { TagComponent } from './tag/tag.component';
import { CredentialComponent } from './credential/credential.component';
import { EnvComponent } from './env/env.component';
import { MenuComponent } from './menu/menu.component';
import { ServerAccountComponent } from './server-account/server-account.component';
import { SshSessionComponent } from './ssh-session/ssh-session.component';
import { NotificationTemplateComponent } from './notification-template/notification-template.component';
import { AssetMaturityComponent } from './asset-maturity/asset-maturity.component';
import { RobotComponent } from './robot/robot.component';
import { ResourceCenterComponent } from './resource-center/resource-center.component';
import { InstanceComponent } from './instance/instance.component';
import { WorkOrderManagementComponent } from './work-order-management/work-order-management.component';
import { AccountEntityComponent } from './account-entity/account-entity.component';

const routes: Routes = [
  {
    path: '',
    component: SysComponent,
    children: [
      { path: 'tag', component: TagComponent },
      { path: 'env', component: EnvComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'resource-center', component: ResourceCenterComponent },
      { path: 'credential', component: CredentialComponent },
      { path: 'ssh-session', component: SshSessionComponent },
      { path: 'server-account', component: ServerAccountComponent },
      { path: 'asset-maturity', component: AssetMaturityComponent },
      { path: 'notification-template', component: NotificationTemplateComponent },
      { path: 'robot', component: RobotComponent },
      { path: 'instance', component: InstanceComponent },
      { path: 'work-order-mgmt', component: WorkOrderManagementComponent },
      { path: 'account/entity', component: AccountEntityComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
