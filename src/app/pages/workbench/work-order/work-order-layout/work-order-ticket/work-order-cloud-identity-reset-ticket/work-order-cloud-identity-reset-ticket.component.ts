import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { CloudIdentityAccount } from '../../../../../../@core/data/work-order-ticket-entry';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { EdsIdentityService } from '../../../../../../@core/services/ext-dataSource-identity.service';
import { finalize } from 'rxjs';
import { EdsCloudAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-work-order-cloud-identity-reset-ticket',
  templateUrl: './work-order-cloud-identity-reset-ticket.component.html',
  styleUrls: [ './work-order-cloud-identity-reset-ticket.component.less' ],
})
export class WorkOrderCloudIdentityResetTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicketComponent') workOrderBaseTicketComponent: WorkOrderBaseTicketComponent;
  @Input() ticketDetails: WorkOrderTicketDetailsVO;
  @Input() editTicketEntryExtTemplate: TemplateRef<any>;
  @Input() edsType: string;
  @Output() onAddTicketEntry = new EventEmitter<EdsCloudAccountVO>();
  @Output() onGetTicket = new EventEmitter<WorkOrderTicketDetailsVO>();
  @Output() onHideDialog = new EventEmitter<null>();
  username: string;
  account: EdsCloudAccountVO;
  accountOptions = [];
  loading: boolean = false;

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private edsIdentityService: EdsIdentityService,
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.onGetIdentityAccount();
  }

  onGetIdentityAccount() {
    this.accountOptions = [];
    this.loading = true;
    this.edsIdentityService.queryCloudIdentityDetails({ username: this.username })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(({ body }) => {
      if (body.accounts[this.edsType]) {
        body.accounts[this.edsType].forEach((account) => {
          account['$unique'] = account.instance.instanceName + ' | ' + account.account.assetKey;
          this.accountOptions.push(account);
        });
      }
    });
  }

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    if (this.account === undefined) {
      this.toastUtil.onErrorToast('Choose at least one account');
      return;
    }
    this.onAddTicketEntry.emit(this.account);
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
    this.workOrderBaseTicketComponent.onGetTicketDetail();
  }

  onCancel() {
    this.onHideDialog.emit();
  }

  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly JSON = JSON;
}
