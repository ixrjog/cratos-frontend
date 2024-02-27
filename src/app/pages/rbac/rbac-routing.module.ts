import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RbacComponent } from './rbac.component';
import { RbacResourceComponent } from './rbac-resource/rbac-resource.component';
import { RbacRoleComponent } from './rbac-role/rbac-role.component';
import { RbacUserRoleComponent } from './rbac-user-role/rbac-user-role.component';

const routes: Routes = [
  {
    path: '',
    component: RbacComponent,
    children: [
      { path: 'resource', component: RbacResourceComponent },
      { path: 'role', component: RbacRoleComponent },
      { path: 'user-role', component: RbacUserRoleComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class RbacRoutingModule {
}
