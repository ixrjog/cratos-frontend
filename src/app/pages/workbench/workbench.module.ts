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
import {
  KubernetesNodesPanelComponent,
} from './kubernetes-nodes/kubernetes-nodes-data/kubernetes-nodes-panel/kubernetes-nodes-panel.component';
import {
  KubernetesNodeCardComponent,
} from './kubernetes-nodes/kubernetes-nodes-data/kubernetes-nodes-panel/kubernetes-node-card/kubernetes-node-card.component';
import {
  KubernetesContainerLifecycleComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-container-lifecycle/kubernetes-container-lifecycle.component';
import {
  KubernetesContainerProbeComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-container-probe/kubernetes-container-probe.component';
import {
  KubernetesPodLogsComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-logs/kubernetes-pod-logs.component';
import {
  KubernetesPodBatchLogsComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-pod-batch-logs/kubernetes-pod-batch-logs.component';
import {
  KubernetesPodExecComponent,
} from './kubernetes-resources/kubernetes-resources-tabs/kubernetes-workloads/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-exec/kubernetes-pod-exec.component';
import { CommandExecComponent } from './command-exec/command-exec.component';
import {
  CommandExecDataTableComponent,
} from './command-exec/command-exec-data-table/command-exec-data-table.component';
import {
  CommandExecEditorComponent,
} from './command-exec/command-exec-data-table/command-exec-editor/command-exec-editor.component';
import {
  CommandExecApproveComponent,
} from './command-exec/command-exec-data-table/command-exec-approve/command-exec-approve.component';
import {
  CommandExecDoComponent,
} from './command-exec/command-exec-data-table/command-exec-do/command-exec-do.component';
import { WorkOrderComponent } from './work-order/work-order.component';
import { WorkOrderLayoutComponent } from './work-order/work-order-layout/work-order-layout.component';
import { WorkOrderMenuComponent } from './work-order/work-order-layout/work-order-menu/work-order-menu.component';
import {
  WorkOrderDataTableComponent,
} from './work-order/work-order-layout/work-order-data-table/work-order-data-table.component';
import {
  WorkOrderApplicationTicketComponent,
} from './work-order/work-order-layout/work-order-ticket/work-order-application-ticket/work-order-application-ticket.component';
import {
  WorkOrderComputerTicketComponent,
} from './work-order/work-order-layout/work-order-ticket/work-order-computer-ticket/work-order-computer-ticket.component';
import {
  WorkOrderBaseTicketComponent,
} from './work-order/work-order-layout/work-order-ticket/work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderBusinessPermissionTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-business-permission-ticket/work-order-business-permission-ticket.component';
import { MarkdownModule } from 'ngx-markdown';

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
    CommandExecComponent,
    CommandExecDataTableComponent,
    CommandExecEditorComponent,
    CommandExecApproveComponent,
    CommandExecDoComponent,
    WorkOrderComponent,
    WorkOrderLayoutComponent,
    WorkOrderMenuComponent,
    WorkOrderDataTableComponent,
    WorkOrderApplicationTicketComponent,
    WorkOrderComputerTicketComponent,
    WorkOrderBaseTicketComponent,
    WorkOrderBusinessPermissionTicketComponent,
  ],
  imports: [
    CommonModule,
    WorkbenchRoutingModule,
    SharedModule,
    MarkdownModule,
  ],
})
export class WorkbenchModule { }
