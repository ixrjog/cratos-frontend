import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfraComponent } from './infra.component';
import { InfraInfoComponent } from './infra-info/infra-info.component';

const routes: Routes = [
  {
    path: '',
    component: InfraComponent,
    children: [
      { path: 'info', component: InfraInfoComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfraRoutingModule {
}
