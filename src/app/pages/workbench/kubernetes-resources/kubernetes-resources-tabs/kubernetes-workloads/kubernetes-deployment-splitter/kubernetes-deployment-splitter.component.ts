import { Component, Input, OnInit } from '@angular/core';
import { DeploymentTemplateSpecContainerVO, KubernetesDeploymentVO } from '../../../../../../@core/data/kubernetes';

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
    this.kubernetesDeployment['$container'] = null;
    this.kubernetesDeployment['$containerMap'] = new Map<string, DeploymentTemplateSpecContainerVO>();
    this.kubernetesDeployment.spec.template.spec.containers.map(container => {
      if (container.main) {
        this.kubernetesDeployment['$container'] = container
        this.kubernetesDeployment['$chosenItem'] = container.name;
      }
      this.kubernetesDeployment['$containers'].push(container.name);
      this.kubernetesDeployment['$containerMap'].set(container.name, container);
    });
  }

  valueChange(item: string): void {
    this.kubernetesDeployment['$container'] = this.kubernetesDeployment['$containerMap'].get(item);
  }

  protected readonly JSON = JSON;

  getResourcesLimits(): string {
    if (JSON.stringify(this.kubernetesDeployment['$container'].resources.limits) !== '{}') {
      return 'cpu '
        + this.kubernetesDeployment['$container'].resources.limits.cpu.amount
        + this.kubernetesDeployment['$container'].resources.limits.cpu.format
        + ' mem '
        + this.kubernetesDeployment['$container'].resources.limits.memory.amount
        + this.kubernetesDeployment['$container'].resources.limits.memory.format;
    }
    return 'no limit';
  }

  getResourcesRequests(): string {
    if (JSON.stringify(this.kubernetesDeployment['$container'].resources.requests) !== '{}') {
      return 'cpu '
        + this.kubernetesDeployment['$container'].resources.requests.cpu.amount
        + this.kubernetesDeployment['$container'].resources.requests.cpu.format
        + ' mem '
        + this.kubernetesDeployment['$container'].resources.requests.memory.amount
        + this.kubernetesDeployment['$container'].resources.requests.memory.format;
    }
    return 'no request';
  }
}
