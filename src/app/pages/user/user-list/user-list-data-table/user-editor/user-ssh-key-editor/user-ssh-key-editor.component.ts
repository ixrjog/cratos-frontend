import { Component, Input } from '@angular/core';
import { AddSshKey, UserVO } from '../../../../../../@core/data/user';
import { CredentialVO } from '../../../../../../@core/data/credential';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { UserService } from '../../../../../../@core/services/user.service';
import { CredentialService } from '../../../../../../@core/services/credential.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { FormLayout } from 'ng-devui/form';
import { RELATIVE_TIME_LIMIT } from '../../../../../../@shared/constant/date.constant';
import { getRowColor } from 'src/app/@shared/utils/data-table.utli';

@Component({
  selector: 'app-user-ssh-key-editor',
  templateUrl: './user-ssh-key-editor.component.html',
  styleUrls: [ './user-ssh-key-editor.component.less' ],
})
export class UserSshKeyEditorComponent {

  @Input() formData: UserVO;
  sshKeyList: CredentialVO[];

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(private userService: UserService,
              private credentialService: CredentialService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  verticalLayout: FormLayout = FormLayout.Vertical;
  sshKey: string;

  fetchData() {
    this.userService.querySshKey({ username: this.formData.username })
      .subscribe(({ body }) => this.sshKeyList = body);
  }

  submitForm({ valid, directive }) {
    if (valid) {
      const param: AddSshKey = {
        pubKey: this.sshKey,
        username: this.formData.username,
      };
      this.userService.addSshKey(param)
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
          this.fetchData();
        });
    } else {
      console.log(directive);
    }
  }

  onRowDelete(rowItem: CredentialVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.credentialService.deleteMyCredentialById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  protected readonly getRowColor = getRowColor;
  protected readonly limit = RELATIVE_TIME_LIMIT;

}
