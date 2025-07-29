import { Component, Input, OnInit } from '@angular/core';
import {
  AccessControlVO,
  DeploymentTemplateSpecContainerVO,
  KubernetesDeploymentVO,
} from '../../../../../../@core/data/kubernetes';
import { ApplicationVO } from '../../../../../../@core/data/application';
import { ApplicationResourceService } from '../../../../../../@core/services/application-resource.service';
import { finalize } from 'rxjs';
import { getPopoverStyle } from '../../../../../../@shared/utils/theme.util';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { RedeployKubernetesDeployment } from '../../../../../../@core/data/application-resource';

@Component({
  selector: 'app-kubernetes-deployment-splitter',
  templateUrl: './kubernetes-deployment-splitter.component.html',
  styleUrls: [ './kubernetes-deployment-splitter.component.less' ],
})
export class KubernetesDeploymentSplitterComponent implements OnInit {

  @Input() kubernetesDeployment: KubernetesDeploymentVO;
  @Input() application: ApplicationVO;
  @Input() accessControl: AccessControlVO;
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
    private toastUtil: ToastUtil
  ) {
  }

  ngOnInit(): void {
    if (!!localStorage.getItem('kubernetes_resources_version')) {
      this.imageVersion = JSON.parse(localStorage.getItem('kubernetes_resources'));
    } else {
      this.imageVersion = {};
    }

    if (!!localStorage.getItem('kubernetes_resources')) {
      this.kubernetesResources = JSON.parse(localStorage.getItem('kubernetes_resources'));
      this.kubernetesDeployment['$chosenItem'] = this.kubernetesResources[this.kubernetesDeployment.metadata.name];
    } else {
      this.kubernetesResources = {};
    }
    this.kubernetesDeployment['$containers'] = [];
    this.kubernetesDeployment['$container'] = null;
    this.kubernetesDeployment['$containerMap'] = new Map<string, DeploymentTemplateSpecContainerVO>();
    this.kubernetesDeployment.spec.template.spec.containers.map(container => {
      if (container.main) {
        if (this.kubernetesDeployment['$chosenItem'] === undefined) {
          this.kubernetesDeployment['$chosenItem'] = container.name;
          this.kubernetesResources[this.kubernetesDeployment.metadata.name] = this.kubernetesDeployment['$chosenItem'];
          this.setItem();
        }
      }
      this.kubernetesDeployment['$containers'].push(container.name);
      this.kubernetesDeployment['$containerMap'].set(container.name, container);
      this.kubernetesDeployment['$container'] = this.kubernetesDeployment['$containerMap'].get(this.kubernetesDeployment['$chosenItem']);
      if (this.kubernetesDeployment['$container'] === undefined) {
        this.kubernetesDeployment['$container'] = this.kubernetesDeployment['$containerMap'].get(this.kubernetesDeployment['$containers'][0]);
      }
      this.getVersionByLocalStorage();
    });
  }

  setItem() {
    localStorage.setItem('kubernetes_resources', JSON.stringify(this.kubernetesResources));
  }

  valueChange(item: string): void {
    this.kubernetesDeployment['$container'] = this.kubernetesDeployment['$containerMap'].get(item);
    this.kubernetesResources[this.kubernetesDeployment.metadata.name] = this.kubernetesDeployment['$chosenItem'];
    this.setItem();
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

  onRowQueryImageVersion() {
    if (this.kubernetesDeployment['$container'] !== undefined && this.kubernetesDeployment['$container'].image !== undefined) {
      const image = this.kubernetesDeployment['$container'].image;
      this.kubernetesDeployment['$container']['$versionLoading'] = true;
      this.applicationResourceService.queryApplicationResourceKubernetesDeploymentImageVersion({ image: image })
        .pipe(
          finalize(() => this.kubernetesDeployment['$container']['$versionLoading'] = false),
        )
        .subscribe(({ body }) => {
          this.kubernetesDeployment['$container']['$imageVersion'] = body;
          this.imageVersion[this.kubernetesDeployment['$container'].image] = body;
          this.setVersionItem();
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
    if (!!localStorage.getItem('kubernetes_resources_version')) {
      const versionMap = JSON.parse(localStorage.getItem('kubernetes_resources_version'));
      if (this.kubernetesDeployment['$container'] !== undefined && versionMap[this.kubernetesDeployment['$container'].image] !== undefined) {
        this.kubernetesDeployment['$container']['$imageVersion'] = versionMap[this.kubernetesDeployment['$container'].image];
      }
    }
  }

  protected readonly getPopoverStyle = getPopoverStyle;

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
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.REDEPLOY);
        });
    });
  }
}
