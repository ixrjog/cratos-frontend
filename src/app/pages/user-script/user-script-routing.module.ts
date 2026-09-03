import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserScriptComponent } from './user-script.component';

const routes: Routes = [
  {
    path: '',
    component: UserScriptComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class UserScriptRoutingModule {
}
