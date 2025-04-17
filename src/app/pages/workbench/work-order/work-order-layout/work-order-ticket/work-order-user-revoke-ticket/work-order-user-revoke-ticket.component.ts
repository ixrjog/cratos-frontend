import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { UserPageQuery, UserVO } from '../../../../../../@core/data/user';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';
import { FormLayout } from 'ng-devui/form';
import { UserService } from '../../../../../../@core/services/user.service';

@Component({
  selector: 'app-work-order-user-revoke-ticket',
  templateUrl: './work-order-user-revoke-ticket.component.html',
  styleUrls: [ './work-order-user-revoke-ticket.component.less' ],
})
export class WorkOrderUserRevokeTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicketComponent') workOrderBaseTicketComponent: WorkOrderBaseTicketComponent;
  @ViewChild('workOrderTicketSearch') custom: TemplateRef<any>;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  businessType: string;
  user: UserVO;

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private userService: UserService,
    private workOrderTicketEntryService: WorkOrderTicketEntryService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.ticketDetails = this.data['formData'];
    this.businessType = this.data['businessType'];
  }

  onSearchUser = (term: string) => {
    const param: UserPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.userService.queryUserPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((user, index) => ({ id: index, option: user })),
        ),
      );
  };

  protected readonly FormLayout = FormLayout;

  onRowAdd() {
    this.workOrderTicketEntryService.addRevokeUserPermissionTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: this.user,
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
}
