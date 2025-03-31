import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { WorkOrderTicketService } from '../../../../../../@core/services/work-order-ticket.service';
import {
  ApprovalTicket,
  SubmitTicket,
  WorkOrderTicketDetailsVO,
  WorkOrderTicketEntryVO,
} from '../../../../../../@core/data/work-order-ticket';
import { SplitterOrientation } from 'ng-devui';
import { finalize } from 'rxjs';
import { getRowColor } from '../../../../../../@shared/utils/data-table.utli';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { WorkflowNodeVO, WorkOrderStatus } from '../../../../../../@core/data/work-order';
import { FormLayout } from 'ng-devui/form';
import { UserVO } from '../../../../../../@core/data/user';
import { APPROVAL_AGREE, APPROVAL_REJECT } from '../../../../../../@shared/constant/approval.constant';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';

@Component({
  selector: 'app-work-order-base-ticket',
  templateUrl: './work-order-base-ticket.component.html',
  styleUrls: [ './work-order-base-ticket.component.less' ],
})
export class WorkOrderBaseTicketComponent {

  @Input() ticketDetails: WorkOrderTicketDetailsVO;
  @Input() editTicketEntryTemplate: TemplateRef<any>;
  @Input() showTicketEntryTemplate: TemplateRef<any>;
  @Input() ticketEntries: WorkOrderTicketEntryVO<any>[];
  @Output() onGetTicket = new EventEmitter<WorkOrderTicketDetailsVO>();
  @Output() onHideDialog = new EventEmitter<null>();

  entryLoading = false;
  orientation: SplitterOrientation = 'horizontal';
  vertical: SplitterOrientation = 'vertical';
  approveRemark: string;
  nodeApprover: Map<string, string> = new Map<string, string>();

  disabled = {
    submit: false,
    approval: false,
    cancel: false,
  };

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private workOrderTicketService: WorkOrderTicketService,
    private toastUtil: ToastUtil,
    private dialogUtil: DialogUtil) {
  }

  onGetTicketDetail() {
    this.entryLoading = true;
    this.workOrderTicketService.getTicket({ ticketNo: this.ticketDetails.ticketNo })
      .pipe(
        finalize(() => this.entryLoading = false),
      )
      .subscribe(({ body }) => this.onGetTicket.emit(body));
  }

  onSubmit() {
    if (this.ticketDetails.entries.length === 0) {
      this.toastUtil.onErrorToast('Please add at least one entry');
      return;
    }
    if (this.ticketDetails.ticket.applyRemark === null) {
      this.toastUtil.onErrorToast('Please fill in the apply remark');
      return;
    }
    this.disabled.submit = true;
    this.disabled.cancel = true;
    const param: SubmitTicket = {
      ticketNo: this.ticketDetails.ticketNo,
      applyRemark: this.ticketDetails.ticket.applyRemark,
      nodeApprovers: this.nodeApprover.size === 0 ? [] : Array.from(this.nodeApprover).map(([ key, value ]) => {
        return { nodeName: key, username: value };
      }),
    };
    this.workOrderTicketService.submitTicket(param)
      .pipe(
        finalize(() => {
          this.disabled.submit = false;
          this.disabled.cancel = false;
        }),
      )
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.SUBMIT);
        this.onCancel();
      });
  }

  onApproval(approvalType: string) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.approve,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.disabled.approval = true;
      this.disabled.cancel = true;
      const param: ApprovalTicket = {
        ticketNo: this.ticketDetails.ticketNo,
        approveRemark: this.approveRemark,
        approvalType: approvalType,
      };
      this.workOrderTicketService.approvalTicket(param)
        .pipe(
          finalize(() => {
            this.disabled.approval = false;
            this.disabled.cancel = false;
          }),
        )
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT[approvalType]);
          this.onCancel();
        });
    });
  }

  onCancel() {
    this.onHideDialog.emit();
  }

  protected readonly getRowColor = getRowColor;
  protected readonly WorkOrderStatus = WorkOrderStatus;
  protected readonly FormLayout = FormLayout;

  onSelectableUsersChange(user: UserVO, node: WorkflowNodeVO) {
    this.nodeApprover.set(node.name, user.username);
  }

  protected readonly APPROVAL_AGREE = APPROVAL_AGREE;
  protected readonly APPROVAL_REJECT = APPROVAL_REJECT;
}
