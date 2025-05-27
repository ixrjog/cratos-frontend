import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { LdapIdentity } from '../../../../../../@core/data/work-order-ticket-entry';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-work-order-ldap-identity-ticket',
  templateUrl: './work-order-ldap-identity-ticket.component.html',
  styleUrls: [ './work-order-ldap-identity-ticket.component.less' ],
})
export class WorkOrderLdapIdentityTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicketComponent') workOrderBaseTicketComponent: WorkOrderBaseTicketComponent;
  @ViewChild('workOrderTicketSearch') custom: TemplateRef<any>;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  ldapGroupOptions = [];
  ldapRoleOptions = [];
  ldapIdentity: LdapIdentity;
  ldapGroup: string = '';
  ldapRoleLoading = false;

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
    this.getLdapGroupOptions();
  }

  getLdapGroupOptions() {
    this.workOrderTicketEntryService.getLdapGroupOptions()
      .subscribe(({ body }) => {
        this.ldapGroupOptions = body.options;
      });
  };

  getLdapRoleOptions(group: string) {
    this.ldapRoleOptions = [];
    this.ldapRoleLoading = true;
    this.workOrderTicketEntryService.queryLdapRolePermissionTicketEntry({ group: group })
      .pipe(finalize(() => {
        this.ldapRoleLoading = false;
      }))
      .subscribe(({ body }) => {
        body.forEach((role) => {
          role['$unique'] = role.asset.assetKey;
          this.ldapRoleOptions.push(role);
        });
      });
  };

  onLdapGroupChange(ldapGroup: any) {
    this.getLdapRoleOptions(ldapGroup.value);
    this.ldapIdentity = null;
  }

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    this.workOrderTicketEntryService.addLdapRolePermissionTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: this.ldapIdentity,
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
