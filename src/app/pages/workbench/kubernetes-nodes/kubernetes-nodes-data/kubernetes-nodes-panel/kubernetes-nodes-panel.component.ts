import { Component, Input } from '@angular/core';
import { KubernetesNodeVO } from '../../../../../@core/data/kubernetes';

@Component({
  selector: 'app-kubernetes-nodes-panel',
  templateUrl: './kubernetes-nodes-panel.component.html',
  styleUrls: [ './kubernetes-nodes-panel.component.less' ],
})
export class KubernetesNodesPanelComponent {

  @Input() isCollapsed = true;
  @Input() zone: string;
  @Input() kubernetesNodes: KubernetesNodeVO[];

}
