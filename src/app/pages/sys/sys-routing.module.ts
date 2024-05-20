import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysComponent } from './sys.component';
import { TagComponent } from './tag/tag.component';
import { CredentialComponent } from './credential/credential.component';
import { EnvComponent } from './env/env.component';
import { MenuComponent } from './menu/menu.component';
import { ServerAccountComponent } from './server-account/server-account.component';

const routes: Routes = [
  {
    path: '',
    component: SysComponent,
    children: [
      { path: 'tag', component: TagComponent },
      { path: 'env', component: EnvComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'credential', component: CredentialComponent },
      { path: 'server-account', component: ServerAccountComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
