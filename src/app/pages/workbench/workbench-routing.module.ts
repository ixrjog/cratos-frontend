import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KubernetesWorkloadComponent } from './kubernetes-workload/kubernetes-workload.component';

const routes: Routes = [
  { path: 'kubernetes-workload', component: KubernetesWorkloadComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class WorkbenchRoutingModule {
}
