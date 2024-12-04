import { Component, Input } from '@angular/core';
import { KubernetesDeploymentVO } from '../../../../../@core/data/kubernetes';

@Component({
  selector: 'app-kubernetes-workload',
  templateUrl: './kubernetes-workload.component.html',
  styleUrls: [ './kubernetes-workload.component.less' ],
})
export class KubernetesDeploymentComponent {

  @Input() deploymentList: KubernetesDeploymentVO[];

}
