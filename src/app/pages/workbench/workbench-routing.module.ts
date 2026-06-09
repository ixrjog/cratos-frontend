import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KubernetesResourcesComponent } from './kubernetes-resources/kubernetes-resources.component';
import { KubernetesNodesComponent } from './kubernetes-nodes/kubernetes-nodes.component';
import { CommandExecComponent } from './command-exec/command-exec.component';
import { WorkOrderComponent } from './work-order/work-order.component';
import { ApplicationCredentialComponent } from './application-credential/application-credential.component';
import { WebTerminalComponent } from './web-terminal/web-terminal.component';
import { KubernetesVersionCompareComponent } from './kubernetes-version-compare/kubernetes-version-compare.component';

const routes: Routes = [
  { path: 'kubernetes-resources', component: KubernetesResourcesComponent },
  { path: 'kubernetes-nodes', component: KubernetesNodesComponent },
  { path: 'kubernetes-version-compare', component: KubernetesVersionCompareComponent },
  { path: 'command-exec', component: CommandExecComponent },
  { path: 'work-order', component: WorkOrderComponent },
  { path: 'application-credential', component: ApplicationCredentialComponent },
  { path: 'web-terminal', component: WebTerminalComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class WorkbenchRoutingModule {
}
