import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { CloudIdentityAccount, CloudPolicy } from '../../../../../../@core/data/work-order-ticket-entry';
import {
  AssetPageQuery,
  EdsAssetVO,
  EdsInstanceVO,
  InstancePageQuery,
} from '../../../../../../@core/data/ext-datasource';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-work-order-cloud-policy-ticket',
  templateUrl: './work-order-cloud-policy-ticket.component.html',
  styleUrls: ['./work-order-cloud-policy-ticket.component.less']
})
export class WorkOrderCloudPolicyTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() ticketDetails: WorkOrderTicketDetailsVO;
  @Input() edsType: string;
  @Input() assetType: string;
  @Output() onAddTicketEntry = new EventEmitter<CloudPolicy>();
  @Output() onGetTicket = new EventEmitter<WorkOrderTicketDetailsVO>();
  @Output() onHideDialog = new EventEmitter<null>();

  instance: EdsInstanceVO = null;
  cloudPolicy: EdsAssetVO = null;
  loading: boolean = false

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private edsService: EdsService,
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
  }

  onSearchCloudInstance = (term: string) => {
    const param: InstancePageQuery = {
      edsType: this.edsType, length: 10, page: 1, queryName: term,
    };
    return this.edsService.queryEdsInstancePage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((instance, index) => ({ id: index, option: instance })),
        ),
      );
  };

  onCloudInstanceChange(edsInstance: EdsInstanceVO) {
    this.instance = edsInstance;
  }

  onSearchCloudPolicy = (term: string) => {
    const param: AssetPageQuery = {
      instanceId: this.instance?.id, assetType: this.assetType, valid: true, length: 10, page: 1, queryName: term,
    };
    this.loading = true
    return this.edsService.queryEdsInstanceAssetPage(param)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
        map(({ body }) =>
          body.data.map((policy, index) => ({ id: index, option: policy })),
        ),
      );
  };

  onCloudPolicyChange(edsAsset: EdsAssetVO) {
    this.cloudPolicy = edsAsset;
  }

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    if (this.instance === undefined) {
      this.toastUtil.onErrorToast('Choose at least one instance');
      return;
    }
    if (this.cloudPolicy === undefined) {
      this.toastUtil.onErrorToast('Choose at least one policy');
      return;
    }
    const cloudIdentity: CloudPolicy = {
      asset: this.cloudPolicy,
    };
    this.onAddTicketEntry.emit(cloudIdentity);
  }

  onRowRemove(entry: WorkOrderTicketEntryVO<CloudIdentityAccount>) {
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

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.onGetTicket.emit(ticketDetails);
  }

  onFetchData() {
    this.workOrderBaseTicket.onGetTicketDetail();
  }

  onCancel() {
    this.onHideDialog.emit();
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly JSON = JSON;
}
