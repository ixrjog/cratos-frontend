import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
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
import { DeleteKubernetesDeploymentPod, JvmClassHistogramVO, OpsJvmClassHistogram, OpsJstack, OpsHeapDump } from '../../../../../../../@core/data/application-resource';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-kubernetes-pod-card',
  templateUrl: './kubernetes-pod-card.component.html',
  styleUrls: [ './kubernetes-pod-card.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KubernetesPodCardComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  @Input() kubernetesPod: KubernetesPodVO;
  @Input() kubernetesDeployment: KubernetesDeploymentVO;
  @Input() containerName: string;
  @Input() application: ApplicationVO;
  @Input() accessControl: AccessControlVO;

  protected readonly limit = RELATIVE_TIME_LIMIT;

  /** Ops dropdown restricted to 'baiyi' or biometric/WebAuthn sessions. */
  canOps = localStorage.getItem('username') === 'baiyi'
    || localStorage.getItem('loginMethod') === 'webauthn';

  /** JVM class histogram result shown in the Ops dialog. */
  @ViewChild('opsHistogramTpl') opsHistogramTpl: TemplateRef<any>;
  histogramResult: JvmClassHistogramVO | null = null;
  opsHistogramLoading = false;
  opsJstackLoading = false;

  opsHeapDumpLoading = false;

  getTotalRestartCount(): number {
    return (this.kubernetesPod.containerStatuses || [])
      .reduce((sum, c) => sum + (c.restartCount || 0), 0);
  }

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
    private cdr: ChangeDetectorRef,
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

  /** Ops: fetch the JVM class histogram (GC.class_histogram) for this container and show it in a dialog. */
  onOpsJvmHistogram() {
    if (this.opsHistogramLoading) {
      return;
    }
    this.opsHistogramLoading = true;
    this.histogramResult = null;
    this.cdr.markForCheck();
    const param: OpsJvmClassHistogram = {
      applicationName: this.application.name,
      instanceId: this.kubernetesDeployment.kubernetesCluster.instanceId,
      instanceName: this.kubernetesDeployment.kubernetesCluster.name,
      namespace: this.kubernetesDeployment.metadata.namespace,
      deploymentName: this.kubernetesDeployment.metadata.name,
      podName: this.kubernetesPod.metadata.name,
      containerName: this.containerName,
    };
    this.applicationResourceService.opsJvmClassHistogram(param)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.opsHistogramLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: ({ body }) => {
          this.histogramResult = body;
          this.openHistogramDialog();
        },
        error: () => this.toastUtil.onErrorToast('Failed to load JVM class histogram'),
      });
  }

  private openHistogramDialog() {
    const results = this.dialogService.open({
      id: 'kubernetes-pod-ops-jvm-histogram',
      width: '60%',
      maxHeight: '1000px',
      backdropCloseable: true,
      showCloseBtn: true,
      escapable: true,
      dialogtype: 'standard',
      title: 'JVM Class Histogram',
      contentTemplate: this.opsHistogramTpl,
      buttons: [
        {
          cssClass: 'common',
          text: 'Close',
          handler: () => results.modalInstance.hide(),
        },
      ],
    });
  }

  /** Ops: submit an async jstack (thread dump) task for this container. */
  onOpsJstack() {
    if (this.opsJstackLoading) {
      return;
    }
    this.opsJstackLoading = true;
    this.cdr.markForCheck();
    const param: OpsJstack = {
      applicationName: this.application.name,
      instanceId: this.kubernetesDeployment.kubernetesCluster.instanceId,
      instanceName: this.kubernetesDeployment.kubernetesCluster.name,
      namespace: this.kubernetesDeployment.metadata.namespace,
      deploymentName: this.kubernetesDeployment.metadata.name,
      podName: this.kubernetesPod.metadata.name,
      containerName: this.containerName,
    };
    this.applicationResourceService.opsJstackTask(param)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.opsJstackLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: ({ body }) => {
          this.toastUtil.onSuccessToast('Jstack task submitted: ' + (body?.taskNo || ''));
        },
        error: () => this.toastUtil.onErrorToast('Failed to submit jstack task'),
      });
  }

  /** Ops: submit an async heap dump task for this container. */
  onOpsHeapDump() {
    if (this.opsHeapDumpLoading) {
      return;
    }
    this.opsHeapDumpLoading = true;
    this.cdr.markForCheck();
    const param: OpsHeapDump = {
      applicationName: this.application.name,
      instanceId: this.kubernetesDeployment.kubernetesCluster.instanceId,
      instanceName: this.kubernetesDeployment.kubernetesCluster.name,
      namespace: this.kubernetesDeployment.metadata.namespace,
      deploymentName: this.kubernetesDeployment.metadata.name,
      podName: this.kubernetesPod.metadata.name,
      containerName: this.containerName,
    };
    this.applicationResourceService.opsHeapDumpTask(param)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.opsHeapDumpLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: ({ body }) => {
          this.toastUtil.onSuccessToast('Heap dump task submitted: ' + (body?.taskNo || ''));
        },
        error: () => this.toastUtil.onErrorToast('Failed to submit heap dump task'),
      });
  }

  onRowDelete() {    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      const param: DeleteKubernetesDeploymentPod = {
          applicationName: this.application.name,
          instanceName: this.kubernetesDeployment.kubernetesCluster.name,
          namespace: this.kubernetesDeployment.metadata.namespace,
          deploymentName: this.kubernetesDeployment.metadata.name,
          podName: this.kubernetesPod.metadata.name,
        };
      this.applicationResourceService.deleteApplicationResourceKubernetesDeploymentPod(param)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
