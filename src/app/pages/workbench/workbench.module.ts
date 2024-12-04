import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkbenchRoutingModule } from './workbench-routing.module';
import { WorkbenchComponent } from './workbench.component';
import { KubernetesResourceComponent } from './kubernetes-resource/kubernetes-resource.component';
import { KubernetesResourceTabsComponent } from './kubernetes-resource/kubernetes-resource-tabs/kubernetes-resource-tabs.component';
import {
  KubernetesDeploymentComponent
} from './kubernetes-resource/kubernetes-resource-tabs/kubernetes-workload/kubernetes-workload.component';
import {
  KubernetesDeploymentSplitterComponent
} from './kubernetes-resource/kubernetes-resource-tabs/kubernetes-workload/kubernetes-deployment-splitter/kubernetes-deployment-splitter.component';
import {
  KubernetesPodCardComponent
} from './kubernetes-resource/kubernetes-resource-tabs/kubernetes-workload/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-card.component';
import {
  KubernetesPodContainersComponent
} from './kubernetes-resource/kubernetes-resource-tabs/kubernetes-workload/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-containers/kubernetes-pod-containers.component';
import {
  KubernetesNetworkComponent
} from './kubernetes-resource/kubernetes-resource-tabs/kubernetes-network/kubernetes-network.component';
import { SharedModule } from '../../@shared/shared.module';
import { KubernetesServiceComponent } from './kubernetes-resource/kubernetes-resource-tabs/kubernetes-network/kubernetes-service/kubernetes-service.component';


@NgModule({
  declarations: [
    WorkbenchComponent,
    KubernetesResourceComponent,
    KubernetesDeploymentComponent,
    KubernetesDeploymentSplitterComponent,
    KubernetesPodCardComponent,
    KubernetesPodContainersComponent,
    KubernetesNetworkComponent,
    KubernetesResourceTabsComponent,
    KubernetesServiceComponent,
  ],
  imports: [
    CommonModule,
    WorkbenchRoutingModule,
    SharedModule,
  ],
})
export class WorkbenchModule { }
