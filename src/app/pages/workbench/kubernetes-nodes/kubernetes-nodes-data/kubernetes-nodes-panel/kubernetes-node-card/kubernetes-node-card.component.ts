import { Component, Input } from '@angular/core';
import { KubernetesNodeVO } from '../../../../../../@core/data/kubernetes';
import { RELATIVE_TIME_LIMIT } from '../../../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-kubernetes-node-card',
  templateUrl: './kubernetes-node-card.component.html',
  styleUrls: [ './kubernetes-node-card.component.less' ],
})
export class KubernetesNodeCardComponent {
  @Input() kubernetesNode: KubernetesNodeVO;
  @Input() kubeletVersion: string;

  protected readonly limit = RELATIVE_TIME_LIMIT;

  showNodeStatusConditions() {
    return this.kubernetesNode.status.conditions['Ready']['status'] !== 'True';
  }

  getNodeStatus() {
    if (this.kubernetesNode.status.conditions['Ready']['status'] === 'True') {
      return 'success';
    }
    return 'warning';
  }

  circleGradientColor = [
    { color: '#50d4ab', percentage: '0%' },
    { color: '#fac20a', percentage: '40%' },
    { color: '#f66f6a', percentage: '100%' },
  ];

}
