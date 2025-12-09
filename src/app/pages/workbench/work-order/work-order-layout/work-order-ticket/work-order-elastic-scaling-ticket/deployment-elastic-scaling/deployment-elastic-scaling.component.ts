import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkOrderTicketDetailsVO } from '../../../../../../../@core/data/work-order-ticket';
import { ApplicationPageQuery, ApplicationVO } from '../../../../../../../@core/data/application';
import { ApplicationService } from '../../../../../../../@core/services/application.service';
import { WorkOrderTicketEntryService } from '../../../../../../../@core/services/work-order-ticket-entry.service';
import { ToastUtil } from '../../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { finalize } from 'rxjs';
import { FormLayout } from 'ng-devui/form';
import { EdsAssetVO } from '../../../../../../../@core/data/ext-datasource';

@Component({
  selector: 'app-deployment-elastic-scaling',
  templateUrl: './deployment-elastic-scaling.component.html',
  styleUrls: [ './deployment-elastic-scaling.component.less' ],
})
export class DeploymentElasticScalingComponent {

  @Output() onFetchData = new EventEmitter<null>();
  protected readonly FormLayout = FormLayout;
  @Input() ticketDetails: WorkOrderTicketDetailsVO;
  application: ApplicationVO = null;
  deployment: EdsAssetVO = null;
  namespace: string = '';
  resourceNamespaceOptions = [];
  deploymentOptions = [];
  expectedReplicas: number;
  nameSpaceLoading = false;

  constructor(
    private applicationService: ApplicationService,
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private toastUtil: ToastUtil) {
  }

  onSearchApplication = (term: string) => {
    const param: ApplicationPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.applicationService.queryApplicationPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((application, index) => ({ id: index, option: application })),
        ),
      );
  };

  onApplicationChange(application: ApplicationVO) {
    this.getResourceNamespaceOptions();
  }

  onResourceNamespaceChange(tab) {
    this.namespace = tab;
    this.onGetDeployment();
  }

  getResourceNamespaceOptions() {
    this.resourceNamespaceOptions = [];
    this.applicationService.getMyResourceNamespaceOptions({ applicationName: this.application.name })
      .pipe(
        finalize(() => {
          this.nameSpaceLoading = false;
        }),
      ).subscribe(
      ({ body }) => this.resourceNamespaceOptions = body.options);
  };

  onGetDeployment() {
    this.deploymentOptions = [];
    this.deployment = null;
    this.workOrderTicketEntryService.queryApplicationResourceDeploymentTicketEntry({
      applicationName: this.application.name,
      namespace: this.namespace,
    }).subscribe(({ body }) => {
      body.forEach((asset) => {
        asset['$unique'] = asset['edsInstance'].instanceName + ':' + asset.assetKey;
        this.deploymentOptions.push(asset);
      });
    });
  }

  onRowAdd() {
    if (this.application === null) {
      this.toastUtil.onErrorToast('application cannot be empty');
      return;
    }
    if (this.namespace === '') {
      this.toastUtil.onErrorToast('namespace cannot be empty');
      return;
    }
    if (this.deployment === null) {
      this.toastUtil.onErrorToast('deployment cannot be empty');
      return;
    }
    if (this.expectedReplicas === undefined) {
      this.toastUtil.onErrorToast('expected replicas cannot be empty');
      return;
    }
    this.workOrderTicketEntryService.addElasticScalingOfDeploymentReplicasTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: {
        deployment: this.deployment,
        namespace: this.namespace,
        expectedReplicas: this.expectedReplicas,
      },
    }).subscribe(() => {
      this.onFetchData.emit();
    });
  }
}
