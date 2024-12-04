import { Component, Input } from '@angular/core';
import { KubernetesServiceVO } from '../../../../../@core/data/kubernetes';

@Component({
  selector: 'app-kubernetes-network',
  templateUrl: './kubernetes-network.component.html',
  styleUrls: [ './kubernetes-network.component.less' ],
})
export class KubernetesNetworkComponent {

  @Input() serviceList: KubernetesServiceVO[];
}
