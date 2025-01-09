import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkbenchRoutingModule } from './workbench-routing.module';
import { WorkbenchComponent } from './workbench.component';
import {
  KubernetesResourcesTabsComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-resources-tabs.component';
import {
  KubernetesWorkloadsComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-workloads.component';
import {
  KubernetesDeploymentSplitterComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-deployment-splitter.component';
import {
  KubernetesPodCardComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-card.component';
import {
  KubernetesPodContainersComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-containers/kubernetes-pod-containers.component';
import {
  KubernetesNetworkComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-network/kubernetes-network.component';
import { SharedModule } from '../../@shared/shared.module';
import {
  KubernetesServiceComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-network/kubernetes-service/kubernetes-service.component';
import { KubernetesResourcesComponent } from './kubernetes-resources/kubernetes-resources.component';
import { KubernetesNodesComponent } from './kubernetes-nodes/kubernetes-nodes.component';
import { KubernetesNodesDataComponent } from './kubernetes-nodes/kubernetes-nodes-data/kubernetes-nodes-data.component';
import { KubernetesNodesPanelComponent } from './kubernetes-nodes/kubernetes-nodes-data/kubernetes-nodes-panel/kubernetes-nodes-panel.component';
import { KubernetesNodeCardComponent } from './kubernetes-nodes/kubernetes-nodes-data/kubernetes-nodes-panel/kubernetes-node-card/kubernetes-node-card.component';
import { KubernetesContainerLifecycleComponent } from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-container-lifecycle/kubernetes-container-lifecycle.component';
import { KubernetesContainerProbeComponent } from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-container-probe/kubernetes-container-probe.component';
import { KubernetesPodLogsComponent } from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-logs/kubernetes-pod-logs.component';
import {
  KubernetesPodBatchLogsComponent
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-pod-batch-logs/kubernetes-pod-batch-logs.component';
import {
  KubernetesPodExecComponent
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-exec/kubernetes-pod-exec.component';


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
    KubernetesNodesComponent,
    KubernetesNodesDataComponent,
    KubernetesNodesPanelComponent,
    KubernetesNodeCardComponent,
    KubernetesContainerLifecycleComponent,
    KubernetesContainerProbeComponent,
    KubernetesPodLogsComponent,
    KubernetesPodBatchLogsComponent,
    KubernetesPodExecComponent,
  ],
  imports: [
    CommonModule,
    WorkbenchRoutingModule,
    SharedModule,
  ],
})
export class WorkbenchModule { }
