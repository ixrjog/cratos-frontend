import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { CloudIdentityAccount } from '../../../../../../@core/data/work-order-ticket-entry';
import { EdsInstanceVO, InstancePageQuery } from '../../../../../../@core/data/ext-datasource';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';

@Component({
  selector: 'app-work-order-cloud-identity-ticket',
  templateUrl: './work-order-cloud-identity-ticket.component.html',
  styleUrls: [ './work-order-cloud-identity-ticket.component.less' ],
})
export class WorkOrderCloudIdentityTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() ticketDetails: WorkOrderTicketDetailsVO;
  @Input() edsType: string;
  @Input() editTicketEntryExtTemplate: TemplateRef<any>;
  @Output() onAddTicketEntry = new EventEmitter<CloudIdentityAccount>();
  @Output() onGetTicket = new EventEmitter<WorkOrderTicketDetailsVO>();
  @Output() onHideDialog = new EventEmitter<null>();

  instance: EdsInstanceVO = null;

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

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    if (this.instance === undefined) {
      this.toastUtil.onErrorToast('Choose at least one instance');
      return;
    }
    const cloudIdentity: CloudIdentityAccount = {
      edsInstance: this.instance,
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
