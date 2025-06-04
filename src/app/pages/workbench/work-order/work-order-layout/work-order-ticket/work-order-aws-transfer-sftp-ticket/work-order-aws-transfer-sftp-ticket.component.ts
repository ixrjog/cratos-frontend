import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import {
  AssetPageQuery,
  EdsAssetVO,
  EdsInstanceVO,
  InstancePageQuery,
} from '../../../../../../@core/data/ext-datasource';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';

@Component({
  selector: 'app-work-order-aws-transfer-sftp-ticket',
  templateUrl: './work-order-aws-transfer-sftp-ticket.component.html',
  styleUrls: [ './work-order-aws-transfer-sftp-ticket.component.less' ],
})
export class WorkOrderAwsTransferSftpTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicketComponent') workOrderBaseTicketComponent: WorkOrderBaseTicketComponent;
  @ViewChild('workOrderTicketSearch') custom: TemplateRef<any>;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  instance: EdsInstanceVO;
  awsTransfer: EdsAssetVO;
  username: string;
  publicKey: string;
  edsType: string = 'AWS';
  assetType: string = 'AWS_TRANSFER_SERVER';
  description: string;
  usernameRegex = '^\\w[\\w@.-]{2,99}$';

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
    this.ticketDetails = this.data['formData'];
  }

  onSearchInstance = (term: string) => {
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

  onInstanceChange(edsInstance: EdsInstanceVO) {
    this.instance = edsInstance;
  }

  onSearchAwsTransfer = (term: string) => {
    const param: AssetPageQuery = {
      instanceId: this.instance?.id,
      assetType: this.assetType,
      valid: true,
      length: 10,
      page: 1,
      queryName: term,
    };
    return this.edsService.queryEdsInstanceAssetPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((awsTransfer, index) => ({ id: index, option: awsTransfer })),
        ),
      );
  };

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    this.workOrderTicketEntryService.addCreateAwsTransferSftpUserTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: {
        asset: this.awsTransfer,
        username: this.username,
        publicKey: this.publicKey,
        description: this.description,
      },
    }).subscribe(() => {
      this.onFetchData();
    });
  }

  onRowRemove(rowItem: WorkOrderTicketEntryVO<any>) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.workOrderTicketEntryService.deleteTicketEntryById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.onFetchData();
        });
    });
  }

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.ticketDetails = ticketDetails;
  }

  onFetchData() {
    this.workOrderBaseTicketComponent.onGetTicketDetail();
  }

  onCancel() {
    this.data.hideDialog();
  }

  protected readonly JSON = JSON;
  protected readonly WorkOrderStatus = WorkOrderStatus;
}
