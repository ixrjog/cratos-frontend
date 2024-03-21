import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysComponent } from './sys.component';
import { TagComponent } from './tag/tag.component';
import { CredentialComponent } from './credential/credential.component';
import { EnvComponent } from './env/env.component';

const routes: Routes = [
  {
    path: '',
    component: SysComponent,
    children: [
      { path: 'tag', component: TagComponent },
      { path: 'env', component: EnvComponent },
      { path: 'credential', component: CredentialComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
