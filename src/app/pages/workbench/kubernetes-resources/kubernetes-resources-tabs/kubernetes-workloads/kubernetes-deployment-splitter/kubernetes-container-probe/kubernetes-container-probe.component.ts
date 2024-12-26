import { Component, Input } from '@angular/core';
import { ContainerProbeVO } from '../../../../../../../@core/data/kubernetes';

@Component({
  selector: 'app-kubernetes-container-probe',
  templateUrl: './kubernetes-container-probe.component.html',
  styleUrls: [ './kubernetes-container-probe.component.less' ],
})
export class KubernetesContainerProbeComponent {

  @Input() startupProbe: ContainerProbeVO;
  @Input() livenessProbe: ContainerProbeVO;
  @Input() readinessProbe: ContainerProbeVO;

}
