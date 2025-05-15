import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KubernetesResourcesComponent } from './kubernetes-resources/kubernetes-resources.component';
import { KubernetesNodesComponent } from './kubernetes-nodes/kubernetes-nodes.component';
import { CommandExecComponent } from './command-exec/command-exec.component';
import { WorkOrderComponent } from './work-order/work-order.component';
import { ApplicationCredentialComponent } from './application-credential/application-credential.component';

const routes: Routes = [
  { path: 'kubernetes-resources', component: KubernetesResourcesComponent },
  { path: 'kubernetes-nodes', component: KubernetesNodesComponent },
  { path: 'command-exec', component: CommandExecComponent },
  { path: 'work-order', component: WorkOrderComponent },
  { path: 'application-credential', component: ApplicationCredentialComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class WorkbenchRoutingModule {
}
