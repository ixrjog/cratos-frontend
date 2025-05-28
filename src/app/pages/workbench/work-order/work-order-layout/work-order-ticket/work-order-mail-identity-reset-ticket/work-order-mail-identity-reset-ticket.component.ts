import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { CloudIdentityAccount } from '../../../../../../@core/data/work-order-ticket-entry';
import { EdsMailAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { EdsIdentityService } from '../../../../../../@core/services/ext-dataSource-identity.service';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { finalize } from 'rxjs';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';

@Component({
  selector: 'app-work-order-mail-identity-reset-ticket',
  templateUrl: './work-order-mail-identity-reset-ticket.component.html',
  styleUrls: [ './work-order-mail-identity-reset-ticket.component.less' ],
})
export class WorkOrderMailIdentityResetTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicketComponent') workOrderBaseTicketComponent: WorkOrderBaseTicketComponent;
  @Input() ticketDetails: WorkOrderTicketDetailsVO;
  @Input() edsType: string;
  @Output() onAddTicketEntry = new EventEmitter<EdsMailAccountVO>();
  @Output() onGetTicket = new EventEmitter<WorkOrderTicketDetailsVO>();
  @Output() onHideDialog = new EventEmitter<null>();
  username: string;
  account: EdsMailAccountVO;
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
    this.edsIdentityService.queryMailIdentityDetails({ username: this.username })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(({ body }) => {
      if (body.accounts[this.edsType]) {
        body.accounts[this.edsType].forEach((account) => {
          account['$unique'] = account.instance.instanceName + ' | ' + account.account.name;
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
