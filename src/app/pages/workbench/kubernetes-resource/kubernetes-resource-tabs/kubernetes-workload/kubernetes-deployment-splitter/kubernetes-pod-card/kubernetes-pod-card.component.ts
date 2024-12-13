import { Component, Input } from '@angular/core';
import { KubernetesDeploymentVO, KubernetesPodVO, PodStatusVO } from '../../../../../../../@core/data/kubernetes';
import { RELATIVE_TIME_LIMIT } from '../../../../../../../@shared/utils/data.util';

@Component({
  selector: 'app-kubernetes-pod-card',
  templateUrl: './kubernetes-pod-card.component.html',
  styleUrls: [ './kubernetes-pod-card.component.less' ],
})
export class KubernetesPodCardComponent {

  @Input() kubernetesPod: KubernetesPodVO;
  @Input() kubernetesDeployment: KubernetesDeploymentVO;
  @Input() containerName: string;

  protected readonly limit = RELATIVE_TIME_LIMIT;

  subPodName(): string {
    return this.kubernetesPod.metadata.name
      .substring(this.kubernetesDeployment.metadata.name.length + 1, this.kubernetesPod.metadata.name.length);
  }

  getContainerPhase(status: PodStatusVO) {
    if (!status.conditions) {
      return 'Unknown';
    }
    if (status.conditions['ContainersReady']['status'] === 'False') {
      return 'Failing';
    }
    if (status.conditions['Ready']['status'] === 'True') {
      return 'Running';
    }
    return 'Waiting';
  }

  getContainerPhaseStyle(status: PodStatusVO) {
    if (!status.conditions) {
      return 'tag-danger';
    }
    if (status.conditions['ContainersReady']['status'] === 'False') {
      return 'tag-danger';
    }
    if (status.conditions['Ready']['status'] === 'True') {
      return 'tag-success';
    }
    return 'tag-initial';
  }

}
