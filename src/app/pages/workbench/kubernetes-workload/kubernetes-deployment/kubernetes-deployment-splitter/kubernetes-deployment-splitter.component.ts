import { Component, Input } from '@angular/core';
import { KubernetesDeploymentVO } from '../../../../../@core/data/kubernetes';

@Component({
  selector: 'app-kubernetes-deployment-splitter',
  templateUrl: './kubernetes-deployment-splitter.component.html',
  styleUrls: [ './kubernetes-deployment-splitter.component.less' ],
})
export class KubernetesDeploymentSplitterComponent {

  @Input() kubernetesDeployment: KubernetesDeploymentVO;

}
