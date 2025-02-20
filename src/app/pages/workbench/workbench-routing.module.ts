import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KubernetesResourcesComponent } from './kubernetes-resources/kubernetes-resources.component';
import { KubernetesNodesComponent } from './kubernetes-nodes/kubernetes-nodes.component';
import { CommandExecComponent } from './command-exec/command-exec.component';

const routes: Routes = [
  { path: 'kubernetes-resources', component: KubernetesResourcesComponent },
  { path: 'kubernetes-nodes', component: KubernetesNodesComponent },
  { path: 'command-exec', component: CommandExecComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class WorkbenchRoutingModule {
}
