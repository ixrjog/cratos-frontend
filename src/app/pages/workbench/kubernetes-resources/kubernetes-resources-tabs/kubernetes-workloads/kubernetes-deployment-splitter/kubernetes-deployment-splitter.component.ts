import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  AccessControlVO,
  DeploymentTemplateSpecContainerVO,
  KubernetesDeploymentVO,
} from '../../../../../../@core/data/kubernetes';
import { ApplicationVO } from '../../../../../../@core/data/application';
import { ApplicationResourceService } from '../../../../../../@core/services/application-resource.service';
import { finalize, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getPopoverStyle } from '../../../../../../@shared/utils/theme.util';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { DialogService } from 'ng-devui';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { RedeployKubernetesDeployment } from '../../../../../../@core/data/application-resource';
import { BusinessTagVO } from '../../../../../../@core/data/business-tag';

@Component({
  selector: 'app-kubernetes-deployment-splitter',
  templateUrl: './kubernetes-deployment-splitter.component.html',
  styleUrls: [ './kubernetes-deployment-splitter.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KubernetesDeploymentSplitterComponent implements OnInit, OnChanges, OnDestroy {

  private destroy$ = new Subject<void>();

  /** True when the current device is detected as mobile via user-agent. */
  private readonly uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  @Input() kubernetesDeployment: KubernetesDeploymentVO;
  @Input() application: ApplicationVO;
  @Input() accessControl: AccessControlVO;
  /** When true, force the simplified (mobile) layout regardless of device. */
  @Input() forceMobile = false;

  /** Effective mobile state: real mobile device OR user-forced compact mode. */
  get isMobile(): boolean {
    return this.uaMobile || this.forceMobile;
  }
  kubernetesResources: any;
  imageVersion: any;

  dialogData = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private applicationResourceService: ApplicationResourceService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    // Parse the persisted maps once (not per container) to keep init off the hot path.
    const versionRaw = localStorage.getItem('kubernetes_resources_version');
    try {
      this.imageVersion = versionRaw ? JSON.parse(versionRaw) : {};
    } catch (e) {
      this.imageVersion = {};
    }

    const resourcesRaw = localStorage.getItem('kubernetes_resources');
    try {
      this.kubernetesResources = resourcesRaw ? JSON.parse(resourcesRaw) : {};
    } catch (e) {
      this.kubernetesResources = {};
    }
    this.initContainerState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // The deployment view is reused across WS pushes (trackBy); when a new
    // deployment object arrives, re-derive the container selector/state.
    if (changes['kubernetesDeployment'] && !changes['kubernetesDeployment'].firstChange && this.kubernetesResources) {
      this.initContainerState();
    }
  }

  /** Derive the container selector state ($containers/$container/$chosenItem) for the current deployment. */
  private initContainerState(): void {
    const dep = this.kubernetesDeployment;
    if (dep['$chosenItem'] === undefined) {
      dep['$chosenItem'] = this.kubernetesResources[dep.metadata.name];
    }
    dep['$containers'] = [];
    dep['$container'] = null;
    dep['$containerMap'] = new Map<string, DeploymentTemplateSpecContainerVO>();
    dep.spec.template.spec.containers.forEach(container => {
      if (container.main) {
        if (dep['$chosenItem'] === undefined) {
          dep['$chosenItem'] = container.name;
          this.kubernetesResources[dep.metadata.name] = dep['$chosenItem'];
          this.setItem();
        }
      }
      dep['$containers'].push(container.name);
      dep['$containerMap'].set(container.name, container);
      dep['$container'] = dep['$containerMap'].get(dep['$chosenItem']);
      if (dep['$container'] === undefined) {
        dep['$container'] = dep['$containerMap'].get(dep['$containers'][0]);
      }
    });
    // Fallback: if nothing is selected (no `main` container) or the persisted
    // selection no longer exists, default to the first container so the radio /
    // tabs and the pod cards always have a valid container highlighted.
    if (dep['$containers'].length > 0 &&
      (dep['$chosenItem'] === undefined || !dep['$containerMap'].has(dep['$chosenItem']))) {
      dep['$chosenItem'] = dep['$containers'][0];
      dep['$container'] = dep['$containerMap'].get(dep['$chosenItem']);
      this.kubernetesResources[dep.metadata.name] = dep['$chosenItem'];
      this.setItem();
    }
    this.getVersionByLocalStorage();
  }

  setItem() {
    localStorage.setItem('kubernetes_resources', JSON.stringify(this.kubernetesResources));
  }

  trackByPod = (_: number, pod: any): string =>
    pod?.metadata?.uid || pod?.metadata?.name || '';

  valueChange(item: string): void {
    // Single source of truth: update the chosen container here so it works for
    // both the desktop radio group ([(ngModel)]) and the compact-mode tabs
    // (one-way [activeTab] + (activeTabChange)). The pod cards are bound to
    // $chosenItem, so it must be updated for the selected container's image to show.
    this.kubernetesDeployment['$chosenItem'] = item;
    this.kubernetesDeployment['$container'] = this.kubernetesDeployment['$containerMap'].get(item);
    this.kubernetesResources[this.kubernetesDeployment.metadata.name] = item;
    this.setItem();
  }

  protected readonly JSON = JSON;

  getResourcesLimits(): string {
    const limits = this.kubernetesDeployment['$container']?.resources?.limits;
    if (limits?.cpu && limits?.memory) {
      return 'cpu '
        + limits.cpu.amount
        + limits.cpu.format
        + ' mem '
        + limits.memory.amount
        + limits.memory.format;
    }
    return 'no limit';
  }

  getResourcesRequests(): string {
    const requests = this.kubernetesDeployment['$container']?.resources?.requests;
    if (requests?.cpu && requests?.memory) {
      return 'cpu '
        + requests.cpu.amount
        + requests.cpu.format
        + ' mem '
        + requests.memory.amount
        + requests.memory.format;
    }
    return 'no request';
  }

  onRowQueryImageVersion() {
    if (this.kubernetesDeployment['$container'] !== undefined && this.kubernetesDeployment['$container'].image !== undefined) {
      const image = this.kubernetesDeployment['$container'].image;
      this.kubernetesDeployment['$container']['$versionLoading'] = true;
      this.applicationResourceService.queryApplicationResourceKubernetesDeploymentImageVersion({ image: image })
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.kubernetesDeployment['$container']['$versionLoading'] = false;
            this.cdr.markForCheck();
          }),
        )
        .subscribe(({ body }) => {
          this.kubernetesDeployment['$container']['$imageVersion'] = body;
          this.imageVersion[this.kubernetesDeployment['$container'].image] = body;
          this.setVersionItem();
          this.cdr.markForCheck();
        });
    }
  }

  setVersionItem() {
    try {
      localStorage.setItem('kubernetes_resources_version', JSON.stringify(this.imageVersion));
    } catch (error) {
    }
  }

  getVersionByLocalStorage() {
    const container = this.kubernetesDeployment['$container'];
    if (container !== undefined && this.imageVersion && this.imageVersion[container.image] !== undefined) {
      container['$imageVersion'] = this.imageVersion[container.image];
    }
  }

  protected readonly getPopoverStyle = getPopoverStyle;

  hasProgressing(): boolean {
    return this.kubernetesDeployment.replicaSets?.some(rs => rs.progressing) || false;
  }

  onRedeploy() {
    const dialogData = {
      ...this.dialogData.warningOperateData,
      content: this.dialogData.content.redeploy,
    };

    this.dialogUtil.onDialog(dialogData, () => {
      const param: RedeployKubernetesDeployment = {
        applicationName: this.application.name,
        instanceName: this.kubernetesDeployment.kubernetesCluster.name,
        namespace: this.kubernetesDeployment.metadata.namespace,
        deploymentName: this.kubernetesDeployment.metadata.name,
      };

      this.applicationResourceService.redeployApplicationResourceKubernetesDeployment(param)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.REDEPLOY);
        });
    });
  }

  getTagValue(businessTag: BusinessTagVO) {
    if (businessTag.tag.tagKey === 'ConfigMap') {
      return 'ConfigMap';
    }
    if (businessTag.tagValue !== '') {
      return businessTag.tag.tagKey + ':' + businessTag.tagValue;
    }
    return businessTag.tag.tagKey;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
