import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { BusinessTypeEnum } from '../../../../../../@core/data/business';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { FormLayout } from 'ng-devui/form';
import { ApplicationPageQuery, ApplicationVO } from '../../../../../../@core/data/application';
import { map } from 'rxjs/operators';
import { finalize } from 'rxjs';
import { EdsAssetVO } from '../../../../../../@core/data/ext-datasource';
import { ApplicationService } from '../../../../../../@core/services/application.service';

@Component({
  selector: 'app-work-order-application-jvm-ticket',
  templateUrl: './work-order-application-jvm-ticket.component.html',
  styleUrls: [ './work-order-application-jvm-ticket.component.less' ],
})
export class WorkOrderApplicationJvmTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() data: any;

  tabActiveId: string | number = 'application';
  ticketDetails: WorkOrderTicketDetailsVO;
  application: ApplicationVO = null;
  deployment: EdsAssetVO = null;
  namespace: string = '';
  resourceNamespaceOptions = [];
  deploymentOptions = [];
  nameSpaceLoading = false;
  jvmSpecType: string = '';
  jvmSpecTypeOptions = [];

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private applicationService: ApplicationService,
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.ticketDetails = this.data['formData'];
    this.getJvmSpecTypeOptions();
  }

  getJvmSpecTypeOptions() {
    this.workOrderTicketEntryService.getApplicationDeploymentJvmSpecTypeOptions()
      .subscribe(({ body }) => {
        this.jvmSpecTypeOptions = body.options;
      });
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
    this.deployment = null;
    this.jvmSpecType = '';
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

  onRowRemove(entry: WorkOrderTicketEntryVO<any>) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.workOrderTicketEntryService.deleteTicketEntryById({ id: entry.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.onFetchData();
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
    if (this.jvmSpecType === '') {
      this.toastUtil.onErrorToast('expected replicas cannot be empty');
      return;
    }
    this.workOrderTicketEntryService.addApplicationDeploymentJvmSpecTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: {
        assetId: this.deployment.id,
        applicationName: this.application.name,
        jvmSpecType: this.jvmSpecType,
      },
    }).subscribe(() => {
      this.onFetchData();
    });
  }

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.ticketDetails = ticketDetails;
  }

  onFetchData() {
    this.workOrderBaseTicket.onGetTicketDetail();
  }

  onCancel() {
    this.data.hideDialog();
  }

  protected readonly JSON = JSON;
  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly BusinessTypeEnum = BusinessTypeEnum;
  protected readonly FormLayout = FormLayout;
}
