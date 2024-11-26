import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkbenchRoutingModule } from './workbench-routing.module';
import { WorkbenchComponent } from './workbench.component';
import { KubernetesWorkloadComponent } from './kubernetes-workload/kubernetes-workload.component';
import { KubernetesDeploymentComponent } from './kubernetes-workload/kubernetes-deployment/kubernetes-deployment.component';
import { SharedModule } from '../../@shared/shared.module';
import { KubernetesDeploymentSplitterComponent } from './kubernetes-workload/kubernetes-deployment/kubernetes-deployment-splitter/kubernetes-deployment-splitter.component';
import { KubernetesPodCardComponent } from './kubernetes-workload/kubernetes-deployment/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-card.component';
import { KubernetesPodContainersComponent } from './kubernetes-workload/kubernetes-deployment/kubernetes-deployment-splitter/kubernetes-pod-card/kubernetes-pod-containers/kubernetes-pod-containers.component';


@NgModule({
  declarations: [
    WorkbenchComponent,
    KubernetesWorkloadComponent,
    KubernetesDeploymentComponent,
    KubernetesDeploymentSplitterComponent,
    KubernetesPodCardComponent,
    KubernetesPodContainersComponent
  ],
  imports: [
    CommonModule,
    WorkbenchRoutingModule,
    SharedModule,
  ],
})
export class WorkbenchModule { }
