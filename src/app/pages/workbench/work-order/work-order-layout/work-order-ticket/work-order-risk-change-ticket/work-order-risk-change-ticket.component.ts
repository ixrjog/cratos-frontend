import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkOrderBaseTicketComponent } from '../work-order-base-ticket/work-order-base-ticket.component';
import { WorkOrderTicketDetailsVO, WorkOrderTicketEntryVO } from '../../../../../../@core/data/work-order-ticket';
import { UserVO } from '../../../../../../@core/data/user';
import { UserService } from '../../../../../../@core/services/user.service';
import { WorkOrderTicketEntryService } from '../../../../../../@core/services/work-order-ticket-entry.service';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { FormLayout } from 'ng-devui/form';
import { WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { map } from 'rxjs/operators';
import { getPopoverStyle } from '../../../../../../@shared/utils/theme.util';

@Component({
  selector: 'app-work-order-risk-change-ticket',
  templateUrl: './work-order-risk-change-ticket.component.html',
  styleUrls: [ './work-order-risk-change-ticket.component.less' ],
})
export class WorkOrderRiskChangeTicketComponent implements OnInit {

  @ViewChild('workOrderBaseTicket') workOrderBaseTicket: WorkOrderBaseTicketComponent;
  @Input() data: any;
  ticketDetails: WorkOrderTicketDetailsVO;
  applicant: UserVO;
  title: string;
  content: string;

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
    private toastUtil: ToastUtil,
  ) {
  }

  ngOnInit(): void {
    this.ticketDetails = this.data['formData'];
    this.content = `#### 变更背景
#### 变更风险
#### 变更项目
+ 项目1
+ 项目2
#### 变更时间
`;
  }

  onSearchUser = (term: string) => {
    return this.userService.queryUserPage({ queryName: term, page: 1, length: 10 })
      .pipe(
        map(({ body }) =>
          body.data.map((user, index) => ({ id: index, option: user })),
        ),
      );
  };

  onRowAdd() {
    this.workOrderTicketEntryService.addRiskChangeTicketEntry({
      ticketId: this.ticketDetails.ticket.id,
      detail: {
        applicant: this.applicant,
        title: this.title,
        content: this.content,
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

  onContentChange(content: string) {
    this.content = content;
  }

  protected readonly FormLayout = FormLayout;
  protected readonly JSON = JSON;
  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly getPopoverStyle = getPopoverStyle;
}
