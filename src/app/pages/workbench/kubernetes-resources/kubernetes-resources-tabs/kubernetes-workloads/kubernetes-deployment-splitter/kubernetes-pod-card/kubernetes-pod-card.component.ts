import { Component, Input } from '@angular/core';
import { KubernetesDeploymentVO, KubernetesPodVO, PodStatusVO } from '../../../../../../../@core/data/kubernetes';
import { ApplicationVO } from '../../../../../../../@core/data/application';
import { DialogService } from 'ng-devui';
import { KubernetesPodLogsComponent } from './kubernetes-pod-logs/kubernetes-pod-logs.component';
import { RELATIVE_TIME_LIMIT } from '../../../../../../../@shared/constant/date.constant';
import { KubernetesPodExecComponent } from './kubernetes-pod-exec/kubernetes-pod-exec.component';

@Component({
  selector: 'app-kubernetes-pod-card',
  templateUrl: './kubernetes-pod-card.component.html',
  styleUrls: [ './kubernetes-pod-card.component.less' ],
})
export class KubernetesPodCardComponent {

  @Input() kubernetesPod: KubernetesPodVO;
  @Input() kubernetesDeployment: KubernetesDeploymentVO;
  @Input() containerName: string;
  @Input() application: ApplicationVO;

  protected readonly limit = RELATIVE_TIME_LIMIT;

  constructor(private dialogService: DialogService) {
  }

  subPodName(): string {
    return this.kubernetesPod.metadata.name
      .substring(this.kubernetesDeployment.metadata.name.length + 1, this.kubernetesPod.metadata.name.length);
  }

  getContainerPhaseStyle(status: PodStatusVO) {
    if (status.phase === 'Failed')  {
      return 'tag-danger';
    }
    if (status.phase === 'Pending')  {
      return 'tag-initial';
    }
    if (status.conditions['Ready']['status'] === 'True') {
      return 'tag-success';
    }
    return 'tag-wait';
  }

  onRowLogs() {
    const results = this.dialogService.open({
      id: 'kubernetes-pod-logs',
      width: '60%',
      maxHeight: '1000px',
      backdropCloseable: false,
      showCloseBtn: false,
      escapable: true,
      dialogtype: 'standard',
      content: KubernetesPodLogsComponent,
      buttons: [],
      data: {
        kubernetesPod: this.kubernetesPod,
        kubernetesDeployment: this.kubernetesDeployment,
        containerName: this.containerName,
        application: this.application,
        closeHandler: () => results.modalInstance.hide(),
      },
    });
  }

  onRowExec() {
    const results = this.dialogService.open({
      id: 'kubernetes-pod-exec',
      width: '60%',
      maxHeight: '1000px',
      backdropCloseable: false,
      showCloseBtn: false,
      escapable: true,
      dialogtype: 'standard',
      content: KubernetesPodExecComponent,
      buttons: [],
      data: {
        kubernetesPod: this.kubernetesPod,
        kubernetesDeployment: this.kubernetesDeployment,
        containerName: this.containerName,
        application: this.application,
        closeHandler: () => results.modalInstance.hide(),
      },
    });
  }
}
