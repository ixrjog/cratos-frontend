import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { ApplicationPageQuery, ApplicationVO } from '../../../../../../@core/data/application';
import { ApplicationService } from '../../../../../../@core/services/application.service';
import { BusinessTypeEnum } from '../../../../../../@core/data/business';

@Component({
  selector: 'app-work-order-pod-delete-ticket',
  templateUrl: './work-order-pod-delete-ticket.component.html',
  styleUrls: [ './work-order-pod-delete-ticket.component.less' ],
})
export class WorkOrderPodDeleteTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicketComponent') workOrderBaseTicketComponent: WorkOrderBaseTicketComponent;
  @ViewChild('workOrderTicketSearch') custom: TemplateRef<any>;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  ticketEntryMap = new Map<string, WorkOrderTicketEntryVO<any>[]>();
  application: ApplicationVO;

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
    this.onTicketEntryConvert()
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

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    this.workOrderTicketEntryService.addApplicationDeletePodTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: this.application,
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
    this.onTicketEntryConvert();
  }

  onFetchData() {
    this.workOrderBaseTicketComponent.onGetTicketDetail();
  }

  onCancel() {
    this.data.hideDialog();
  }

  protected readonly JSON = JSON;
  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly BusinessTypeEnum = BusinessTypeEnum;
}
