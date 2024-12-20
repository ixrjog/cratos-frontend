import { Component, Input } from '@angular/core';
import { KubernetesNodeVO } from '../../../../../../@core/data/kubernetes';

@Component({
  selector: 'app-kubernetes-node-card',
  templateUrl: './kubernetes-node-card.component.html',
  styleUrls: [ './kubernetes-node-card.component.less' ],
})
export class KubernetesNodeCardComponent {
  @Input() kubernetesNode: KubernetesNodeVO;
}
