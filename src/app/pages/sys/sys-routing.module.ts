import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysComponent } from './sys.component';
import { TagComponent } from './tag/tag.component';
import { CredentialComponent } from './credential/credential.component';

const routes: Routes = [
  {
    path: '',
    component: SysComponent,
    children: [
      { path: 'tag', component: TagComponent },
      { path: 'credential', component: CredentialComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
