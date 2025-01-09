import { Component, Input } from '@angular/core';
import { KubernetesDeploymentVO } from '../../../../../@core/data/kubernetes';
import { ApplicationVO } from '../../../../../@core/data/application';
import { DRAWER_DATA, DrawerUtil } from '../../../../../@shared/utils/drawer.util';
import { KubernetesPodBatchLogsComponent } from './kubernetes-pod-batch-logs/kubernetes-pod-batch-logs.component';

@Component({
  selector: 'app-kubernetes-workloads',
  templateUrl: './kubernetes-workloads.component.html',
  styleUrls: [ './kubernetes-workloads.component.less' ],
})
export class KubernetesWorkloadsComponent {

  @Input() deploymentList: KubernetesDeploymentVO[];
  @Input() application: ApplicationVO;

  constructor(private drawerUtil: DrawerUtil) {
  }

  drawerDate = {
    editorData: {
      ...DRAWER_DATA.editorData,
      zIndex: 2500,
      width: '1000px',
      drawerContentComponent: KubernetesPodBatchLogsComponent,
    },
  };

  getTotalReplicas() {
    return this.deploymentList.reduce((total, current) => {
      return total + current.spec.replicas;
    }, 0);
  }

  onBatchLogs() {
    const drawerDate = {
      ...this.drawerDate.editorData,
    };
    const formData = {
      deploymentList: this.deploymentList,
      application: this.application,
    };
    this.drawerUtil.onDrawer(drawerDate, formData);
  }

}
