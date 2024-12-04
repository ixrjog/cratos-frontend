import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KubernetesResourceComponent } from './kubernetes-resource/kubernetes-resource.component';

const routes: Routes = [
  { path: 'kubernetes-resource', component: KubernetesResourceComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class WorkbenchRoutingModule {
}
