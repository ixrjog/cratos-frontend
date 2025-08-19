import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { UserService } from '../../../../@core/services/user.service';
import { CredentialVO } from '../../../../@core/data/credential';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { CredentialService } from '../../../../@core/services/credential.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { AddSshKey } from '../../../../@core/data/user';

@Component({
  selector: 'app-user-ssh-key-settings',
  templateUrl: './user-ssh-key-settings.component.html',
  styleUrls: [ './user-ssh-key-settings.component.less' ],
})
export class UserSshKeySettingsComponent implements OnInit {

  sshKeyList: CredentialVO[];
  hostUrl: string;

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

  @Input() username: string;
  verticalLayout: FormLayout = FormLayout.Vertical;
  sshKey: string;

  ngOnInit(): void {
    this.hostUrl = window.location.hostname;
    this.fetchData();
  }

  fetchData() {
    this.userService.queryMySshKey()
      .subscribe(({ body }) => this.sshKeyList = body);
  }

  submitForm({ valid, directive }) {
    if (valid) {
      const param: AddSshKey = {
        pubKey: this.sshKey,
      };
      this.userService.addMySshKey(param)
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
