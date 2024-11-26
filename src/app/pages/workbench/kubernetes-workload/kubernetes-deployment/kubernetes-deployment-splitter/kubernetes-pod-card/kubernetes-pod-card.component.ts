import { Component, Input } from '@angular/core';
import { KubernetesPodVO } from '../../../../../../@core/data/kubernetes';
import { RELATIVE_TIME_LIMIT } from '../../../../../../@shared/utils/data.util';

@Component({
  selector: 'app-kubernetes-pod-card',
  templateUrl: './kubernetes-pod-card.component.html',
  styleUrls: [ './kubernetes-pod-card.component.less' ],
})
export class KubernetesPodCardComponent {

  @Input() kubernetesPod: KubernetesPodVO;

  protected readonly limit = RELATIVE_TIME_LIMIT;
}
