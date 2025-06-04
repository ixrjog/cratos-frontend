import { Component, Input } from '@angular/core';
import {
  AccessControlVO,
  KubernetesDeploymentVO,
  KubernetesDetailsBannerVO,
} from '../../../../../@core/data/kubernetes';
import { ApplicationVO } from '../../../../../@core/data/application';
import { DRAWER_DATA, DrawerUtil } from '../../../../../@shared/utils/drawer.util';
import { KubernetesPodBatchLogsComponent } from './kubernetes-pod-batch-logs/kubernetes-pod-batch-logs.component';
import { getPopoverStyle } from '../../../../../@shared/utils/theme.util';
import { HelperUtils } from 'ng-devui';

@Component({
  selector: 'app-kubernetes-workloads',
  templateUrl: './kubernetes-workloads.component.html',
  styleUrls: [ './kubernetes-workloads.component.less' ],
})
export class KubernetesWorkloadsComponent {

  @Input() deploymentList: KubernetesDeploymentVO[];
  @Input() application: ApplicationVO;
  @Input() accessControl: AccessControlVO;
  @Input() banner: KubernetesDetailsBannerVO;

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

  protected readonly JSON = JSON;
  protected readonly getPopoverStyle = getPopoverStyle;

  onRouteArms() {
    HelperUtils.jumpOuterUrl(this.banner.arms.home);
  }
}
