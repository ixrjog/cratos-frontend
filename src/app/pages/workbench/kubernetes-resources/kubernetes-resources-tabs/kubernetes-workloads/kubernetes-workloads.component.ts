import { Component, Input } from '@angular/core';
import { KubernetesDeploymentVO } from '../../../../../@core/data/kubernetes';
import { ApplicationVO } from '../../../../../@core/data/application';

@Component({
  selector: 'app-kubernetes-workloads',
  templateUrl: './kubernetes-workloads.component.html',
  styleUrls: [ './kubernetes-workloads.component.less' ],
})
export class KubernetesWorkloadsComponent {

  @Input() deploymentList: KubernetesDeploymentVO[];
  @Input() application: ApplicationVO;

  getTotalReplicas() {
    return this.deploymentList.reduce((total, current) => {
      return total + current.spec.replicas;
    }, 0);
  }

}
