import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { ApproveCommandExec, CommandExecVO } from '../../../../../@core/data/command';
import { DValidateRules } from 'ng-devui';
import { CommandService } from '../../../../../@core/services/command.service';
import { DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { finalize } from 'rxjs';
import { APPROVAL_AGREE, APPROVAL_REJECT } from '../../../../../@shared/constant/approval.constant';

@Component({
  selector: 'app-command-exec-approve',
  templateUrl: './command-exec-approve.component.html',
  styleUrls: [ './command-exec-approve.component.less' ],
})
export class CommandExecApproveComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: CommandExecVO;

  approveRemark: string = '';


  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
  };

  constructor(private commandService: CommandService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  agree() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.approve,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.data.canConfirm(false);
      const param: ApproveCommandExec = {
        commandExecId: this.formData.id,
        approveRemark: this.approveRemark,
        approvalAction: APPROVAL_AGREE,
      };
      this.commandService.approveCommandExec(param)
        .pipe(
          finalize(() => {
            this.data.canConfirm(true);
          }),
        ).subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.AGREE);
        });
    });
  }

  reject() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.reject,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.data.canConfirm(false);
      const param: ApproveCommandExec = {
        commandExecId: this.formData.id,
        approveRemark: this.approveRemark,
        approvalAction: APPROVAL_REJECT,
      };
      this.commandService.approveCommandExec(param)
        .pipe(
          finalize(() => {
            this.data.canConfirm(true);
          }),
        ).subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.REJECT);
        });
    });
  }

}
