import { Component, Input, OnInit } from '@angular/core';
import { KubernetesDeploymentVO } from '../../../../../../@core/data/kubernetes';

@Component({
  selector: 'app-kubernetes-deployment-splitter',
  templateUrl: './kubernetes-deployment-splitter.component.html',
  styleUrls: [ './kubernetes-deployment-splitter.component.less' ],
})
export class KubernetesDeploymentSplitterComponent implements OnInit {

  @Input() kubernetesDeployment: KubernetesDeploymentVO;

  ngOnInit(): void {
    this.kubernetesDeployment['$chosenItem'] = '';
    this.kubernetesDeployment['$containers'] = [];
    this.kubernetesDeployment['$containerImageMap'] = new Map<string, string>();
    this.kubernetesDeployment['$chosenItemImage'] = '';
    this.kubernetesDeployment.spec.template.spec.containers.map(container => {
      if (container.main) {
        this.kubernetesDeployment['$chosenItem'] = container.name;
        this.kubernetesDeployment['$chosenItemImage'] = container.image;
      }
      this.kubernetesDeployment['$containers'].push(container.name);
      this.kubernetesDeployment['$containerImageMap'].set(container.name, container.image);
    });
  }

  valueChange(item: string): void {
    this.kubernetesDeployment['$chosenItemImage'] = this.kubernetesDeployment['$containerImageMap'].get(item);
  }

  protected readonly JSON = JSON;
  protected readonly Array = Array;
}
