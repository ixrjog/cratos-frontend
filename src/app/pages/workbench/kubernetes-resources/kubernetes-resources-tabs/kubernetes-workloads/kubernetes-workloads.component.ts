import { Component, Input } from '@angular/core';
import { KubernetesDeploymentVO } from '../../../../../@core/data/kubernetes';

@Component({
  selector: 'app-kubernetes-workloads',
  templateUrl: './kubernetes-workloads.component.html',
  styleUrls: [ './kubernetes-workloads.component.less' ],
})
export class KubernetesWorkloadsComponent {

  @Input() deploymentList: KubernetesDeploymentVO[];

}
