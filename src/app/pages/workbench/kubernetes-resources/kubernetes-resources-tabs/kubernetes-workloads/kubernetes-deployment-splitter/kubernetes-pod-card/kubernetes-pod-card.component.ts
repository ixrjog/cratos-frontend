import { Component, Input } from '@angular/core';
import {
  AccessControlVO,
  KubernetesDeploymentVO,
  KubernetesPodVO,
  PodStatusVO,
} from '../../../../../../../@core/data/kubernetes';
import { ApplicationVO } from '../../../../../../../@core/data/application';
import { DialogService } from 'ng-devui';
import { KubernetesPodLogsComponent } from './kubernetes-pod-logs/kubernetes-pod-logs.component';
import { RELATIVE_TIME_LIMIT } from '../../../../../../../@shared/constant/date.constant';
import { KubernetesPodExecComponent } from './kubernetes-pod-exec/kubernetes-pod-exec.component';
import { DIALOG_DATA, DialogUtil } from '../../../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../../@shared/utils/toast.util';
import { ApplicationResourceService } from '../../../../../../../@core/services/application-resource.service';
import { DeleteKubernetesDeploymentPod } from '../../../../../../../@core/data/application-resource';

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
  @Input() accessControl: AccessControlVO;

  protected readonly limit = RELATIVE_TIME_LIMIT;

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private applicationResourceService: ApplicationResourceService,
    private dialogService: DialogService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
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

  onRowDelete() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      const param: DeleteKubernetesDeploymentPod = {
          applicationName: this.application.name,
          namespace: this.kubernetesDeployment.metadata.namespace,
          deploymentName: this.kubernetesDeployment.metadata.name,
          podName: this.kubernetesPod.metadata.name,
        };
      this.applicationResourceService.deleteApplicationResourceKubernetesDeploymentPod(param)
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
        });
    });
  }
}
