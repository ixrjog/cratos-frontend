import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { BusinessTypeEnum } from '../../../../../../@core/data/business';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { FormLayout } from 'ng-devui/form';

@Component({
  selector: 'app-work-order-elastic-scaling-ticket',
  templateUrl: './work-order-elastic-scaling-ticket.component.html',
  styleUrls: [ './work-order-elastic-scaling-ticket.component.less' ],
})
export class WorkOrderElasticScalingTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() data: any;

  tabActiveId: string | number = 'application';
  ticketDetails: WorkOrderTicketDetailsVO;
  ticketEntryMap = new Map<string, WorkOrderTicketEntryVO<any>[]>();

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.ticketDetails = this.data['formData'];
    this.onTicketEntryConvert();
  }

  onTicketEntryConvert() {
    this.ticketEntryMap = new Map<string, WorkOrderTicketEntryVO<any>[]>();
    this.ticketDetails.entries.forEach((entry) => {
      const key: string = entry.businessType;
      if (!this.ticketEntryMap.has(key)) {
        this.ticketEntryMap.set(key, []);
      }
      this.ticketEntryMap.get(key).push(entry);
    });
  }

  onRowRemoveAll(rowItem: WorkOrderTicketEntryVO<any>) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.workOrderTicketEntryService.deleteAllTicketEntryByTicketId({ ticketId: rowItem.ticketId })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.onFetchData();
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

  onGetTicketDetail(ticketDetails: WorkOrderTicketDetailsVO) {
    this.ticketDetails = ticketDetails;
    this.onTicketEntryConvert();
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
