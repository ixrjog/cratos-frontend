import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkbenchRoutingModule } from './workbench-routing.module';
import { WorkbenchComponent } from './workbench.component';
import { KubernetesResourcesTabsComponent } from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-resources-tabs.component';
import {
  KubernetesWorkloadsComponent
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-workloads.component';
import {
  KubernetesDeploymentSplitterComponent
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-deployment-splitter.component';
import {
  KubernetesPodCardComponent
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-card.component';
import {
  KubernetesPodContainersComponent
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-containers/kubernetes-pod-containers.component';
import {
  KubernetesNetworkComponent
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-network/kubernetes-network.component';
import { SharedModule } from '../../@shared/shared.module';
import { KubernetesServiceComponent } from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-network/kubernetes-service/kubernetes-service.component';
import { KubernetesResourcesComponent } from './kubernetes-resources/kubernetes-resources.component';


@NgModule({
  declarations: [
    WorkbenchComponent,
    KubernetesResourcesComponent,
    KubernetesWorkloadsComponent,
    KubernetesDeploymentSplitterComponent,
    KubernetesPodCardComponent,
    KubernetesPodContainersComponent,
    KubernetesNetworkComponent,
    KubernetesResourcesTabsComponent,
    KubernetesServiceComponent,
  ],
  imports: [
    CommonModule,
    WorkbenchRoutingModule,
    SharedModule,
  ],
})
export class WorkbenchModule { }
