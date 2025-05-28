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
  WorkOrderBaseTicketComponent,
} from './work-order/work-order-layout/work-order-ticket/work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderBusinessPermissionTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-business-permission-ticket/work-order-business-permission-ticket.component';
import { MarkdownModule } from 'ngx-markdown';
import { WorkOrderApprovalProcessComponent } from './work-order/work-order-layout/work-order-ticket/work-order-base-ticket/work-order-approval-process/work-order-approval-process.component';
import { WorkOrderUserRevokeTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-user-revoke-ticket/work-order-user-revoke-ticket.component';
import { WorkOrderGitlabTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-gitlab-ticket/work-order-gitlab-ticket.component';
import { WorkOrderElasticScalingTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-elastic-scaling-ticket/work-order-elastic-scaling-ticket.component';
import { ApplicationElasticScalingComponent } from './work-order/work-order-layout/work-order-ticket/work-order-elastic-scaling-ticket/application-elastic-scaling/application-elastic-scaling.component';
import { DeploymentElasticScalingComponent } from './work-order/work-order-layout/work-order-ticket/work-order-elastic-scaling-ticket/deployment-elastic-scaling/deployment-elastic-scaling.component';
import { WorkOrderAliyunDataworksTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-aliyun-dataworks-ticket/work-order-aliyun-dataworks-ticket.component';
import { WorkOrderPodDeleteTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-pod-delete-ticket/work-order-pod-delete-ticket.component';
import { CommandExecViewComponent } from './command-exec/command-exec-data-table/command-exec-view/command-exec-view.component';
import { ApplicationCredentialComponent } from './application-credential/application-credential.component';
import { ApplicationCredentialDataTableComponent } from './application-credential/application-credential-data-table/application-credential-data-table.component';
import { WorkOrderCloudIdentityTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-cloud-identity-ticket/work-order-cloud-identity-ticket.component';
import { WorkOrderApplicationTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-business-permission-ticket/work-order-application-ticket/work-order-application-ticket.component';
import {
  WorkOrderComputerTicketComponent
} from './work-order/work-order-layout/work-order-ticket/work-order-business-permission-ticket/work-order-computer-ticket/work-order-computer-ticket.component';
import {
  WorkOrderGitlabGroupTicketComponent
} from './work-order/work-order-layout/work-order-ticket/work-order-gitlab-ticket/work-order-gitlab-group-ticket/work-order-gitlab-group-ticket.component';
import {
  WorkOrderGitlabProjectTicketComponent
} from './work-order/work-order-layout/work-order-ticket/work-order-gitlab-ticket/work-order-gitlab-project-ticket/work-order-gitlab-project-ticket.component';
import {
  WorkOrderAliyunRamTicketComponent
} from './work-order/work-order-layout/work-order-ticket/work-order-cloud-identity-ticket/work-order-aliyun-ram-ticket/work-order-aliyun-ram-ticket.component';
import { WorkOrderCloudPolicyTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-cloud-policy-ticket/work-order-cloud-policy-ticket.component';
import { WorkOrderAliyunRamPolicyTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-cloud-policy-ticket/work-order-aliyun-ram-policy-ticket/work-order-aliyun-ram-policy-ticket.component';
import { WorkOrderCloudIdentityResetTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-cloud-identity-reset-ticket/work-order-cloud-identity-reset-ticket.component';
import { WorkOrderAliyunRamResetTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-cloud-identity-reset-ticket/work-order-aliyun-ram-reset-ticket/work-order-aliyun-ram-reset-ticket.component';
import { WorkOrderLdapIdentityTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-ldap-identity-ticket/work-order-ldap-identity-ticket.component';
import { WorkOrderMailIdentityResetTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-mail-identity-reset-ticket/work-order-mail-identity-reset-ticket.component';
import { WorkOrderAlimailIdentityResetTicketComponent } from './work-order/work-order-layout/work-order-ticket/work-order-mail-identity-reset-ticket/work-order-alimail-identity-reset-ticket/work-order-alimail-identity-reset-ticket.component';

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
    WorkOrderApprovalProcessComponent,
    WorkOrderUserRevokeTicketComponent,
    WorkOrderGitlabTicketComponent,
    WorkOrderGitlabGroupTicketComponent,
    WorkOrderGitlabProjectTicketComponent,
    WorkOrderElasticScalingTicketComponent,
    ApplicationElasticScalingComponent,
    DeploymentElasticScalingComponent,
    WorkOrderAliyunDataworksTicketComponent,
    WorkOrderPodDeleteTicketComponent,
    CommandExecViewComponent,
    ApplicationCredentialComponent,
    ApplicationCredentialDataTableComponent,
    WorkOrderCloudIdentityTicketComponent,
    WorkOrderAliyunRamTicketComponent,
    WorkOrderCloudPolicyTicketComponent,
    WorkOrderAliyunRamPolicyTicketComponent,
    WorkOrderCloudIdentityResetTicketComponent,
    WorkOrderAliyunRamResetTicketComponent,
    WorkOrderLdapIdentityTicketComponent,
    WorkOrderMailIdentityResetTicketComponent,
    WorkOrderAlimailIdentityResetTicketComponent,
  ],
  imports: [
    CommonModule,
    WorkbenchRoutingModule,
    SharedModule,
    MarkdownModule,
  ],
})
export class WorkbenchModule { }
