import { Component, Input } from '@angular/core';
import { ContainerLifecycleVO } from '../../../../../../../@core/data/kubernetes';

@Component({
  selector: 'app-kubernetes-container-lifecycle',
  templateUrl: './kubernetes-container-lifecycle.component.html',
  styleUrls: [ './kubernetes-container-lifecycle.component.less' ],
})
export class KubernetesContainerLifecycleComponent {

  @Input() lifecycle: ContainerLifecycleVO;

}
