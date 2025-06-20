import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { EdsInstanceVO } from '../../../../../../@core/data/ext-datasource';


@Component({
  selector: 'app-work-order-aliyun-dataworks-ticket',
  templateUrl: './work-order-aliyun-dataworks-ticket.component.html',
  styleUrls: [ './work-order-aliyun-dataworks-ticket.component.less' ],
})
export class WorkOrderAliyunDataworksTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  instance: EdsInstanceVO;

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
  }

  onSearchInstance = (term: string) => {
    return this.workOrderTicketEntryService.queryDataWorksInstanceTicketEntry()
      .pipe(
        map(({ body }) =>
          body.map((instance, index) => ({ id: index, option: instance })),
        ),
      );
  };

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    this.workOrderTicketEntryService.addDataWorksInstanceTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: {
        edsInstance: this.instance,
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
    this.workOrderBaseTicket.onGetTicketDetail();
  }

  onCancel() {
    this.data.hideDialog();
  }

  protected readonly JSON = JSON;
  protected readonly WorkOrderStatus = WorkOrderStatus;
}

