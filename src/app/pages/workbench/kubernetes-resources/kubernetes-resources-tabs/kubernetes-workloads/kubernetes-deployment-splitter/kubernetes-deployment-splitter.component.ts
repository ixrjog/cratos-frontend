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
    this.kubernetesDeployment['$containerResourcesMap'] = new Map<string, string>();
    this.kubernetesDeployment['$chosenItemImage'] = '';
    this.kubernetesDeployment.spec.template.spec.containers.map(container => {
      if (container.main) {
        this.kubernetesDeployment['$chosenItem'] = container.name;
        this.kubernetesDeployment['$chosenItemImage'] = container.image;
        this.kubernetesDeployment['$containerResources'] = container.resources;
      }
      this.kubernetesDeployment['$containers'].push(container.name);
      this.kubernetesDeployment['$containerImageMap'].set(container.name, container.image);
      this.kubernetesDeployment['$containerResourcesMap'].set(container.name, container.resources);
    });
  }

  valueChange(item: string): void {
    this.kubernetesDeployment['$chosenItemImage'] = this.kubernetesDeployment['$containerImageMap'].get(item);
    this.kubernetesDeployment['$containerResources'] = this.kubernetesDeployment['$containerResourcesMap'].get(item);
  }

  protected readonly JSON = JSON;

  getResourcesLimits(): string {
    if (JSON.stringify(this.kubernetesDeployment['$containerResources'].limits) !== '{}') {
      return 'cpu '
        + this.kubernetesDeployment['$containerResources'].limits.cpu.amount
        + this.kubernetesDeployment['$containerResources'].limits.cpu.format
        + ' mem '
        + this.kubernetesDeployment['$containerResources'].limits.memory.amount
        + this.kubernetesDeployment['$containerResources'].limits.memory.format;
    }
    return 'no limit';
  }

  getResourcesRequests(): string {
    if (JSON.stringify(this.kubernetesDeployment['$containerResources'].requests) !== '{}') {
      return 'cpu '
        + this.kubernetesDeployment['$containerResources'].requests.cpu.amount
        + this.kubernetesDeployment['$containerResources'].requests.cpu.format
        + ' mem '
        + this.kubernetesDeployment['$containerResources'].requests.memory.amount
        + this.kubernetesDeployment['$containerResources'].requests.memory.format;
    }
    return 'no request';
  }
}
