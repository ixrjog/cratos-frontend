import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KubernetesResourcesComponent } from './kubernetes-resources/kubernetes-resources.component';
import { KubernetesNodesComponent } from './kubernetes-nodes/kubernetes-nodes.component';
import { CommandExecComponent } from './command-exec/command-exec.component';
import { WorkOrderComponent } from './work-order/work-order.component';
import { ApplicationCredentialComponent } from './application-credential/application-credential.component';
import { WebTerminalComponent } from './web-terminal/web-terminal.component';
import { KubernetesVersionCompareComponent } from './kubernetes-version-compare/kubernetes-version-compare.component';
import { ImageMirrorComponent } from './image-mirror/image-mirror.component';
import { CloudAkApplyComponent } from './cloud-ak-apply/cloud-ak-apply.component';
import { ArtifactPublishComponent } from './artifact-publish/artifact-publish.component';
import { ApolloPortalImageBuildComponent } from './apollo-portal-image-build/apollo-portal-image-build.component';
import { AppContinuousDeliveryComponent } from './app-continuous-delivery/app-continuous-delivery.component';

const routes: Routes = [
  { path: 'kubernetes-resources', component: KubernetesResourcesComponent },
  { path: 'kubernetes-nodes', component: KubernetesNodesComponent },
  { path: 'kubernetes-version-compare', component: KubernetesVersionCompareComponent },
  { path: 'command-exec', component: CommandExecComponent },
  { path: 'work-order', component: WorkOrderComponent },
  { path: 'application-credential', component: ApplicationCredentialComponent },
  { path: 'web-terminal', component: WebTerminalComponent },
  { path: 'image-mirror', component: ImageMirrorComponent },
  { path: 'cloud-ak-apply', component: CloudAkApplyComponent },
  { path: 'artifact-publish', component: ArtifactPublishComponent },
  { path: 'apollo-portal-image-build', component: ApolloPortalImageBuildComponent },
  { path: 'app-continuous-delivery', component: AppContinuousDeliveryComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class WorkbenchRoutingModule {
}
