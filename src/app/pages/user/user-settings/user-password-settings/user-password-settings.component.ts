import { Component } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { UserService } from '../../../../@core/services/user.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { DValidateRules } from 'ng-devui';

@Component({
  selector: 'app-user-password-settings',
  templateUrl: './user-password-settings.component.html',
  styleUrls: [ './user-password-settings.component.less' ],
})
export class UserPasswordSettingsComponent {

  constructor(private userService: UserService,
              private toastUtil: ToastUtil) {
  }

  showPassword = false;
  showConfirmPassword = false;
  showOldPassword = false;

  formData = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
  };
  verticalLayout: FormLayout = FormLayout.Vertical;

  formRules: { [key: string]: DValidateRules } = {
    oldPassword: {
      validators: [{ required: true }],
      message: 'Old password is required.',
    },
    password: {
      validators: [
        { required: true },
        { minlength: 8 },
        { maxlength: 20 },
        { pattern: /^[a-zA-Z0-9\d!@#$%^&*()_+-=]+(\s+[a-zA-Z0-9]+)*$/ },
      ],
      message: 'Enter a password that contains 8 to 20 digits and letters.',
    },
    confirmPassword: [
      { required: true },
      {
        sameToPassWord: this.sameToPassWord.bind(this),
        message: { 'en-us': 'Ensure that the two passwords are the same.', 'zh-cn': '请确保密码一致' },
      },
      { minlength: 8 },
      { maxlength: 20 },
      {
        pattern: /^[a-zA-Z0-9\d!@#$%^&*()_+-=]+(\s+[a-zA-Z0-9]+)*$/,
        message: 'The password must contain 8 to 20 digits and letters.',
      },
    ],
  };

  submitForm({ valid, directive }) {
    if (valid) {
      const param = {
        oldPassword: this.formData.oldPassword,
        password: this.formData.password,
      };
      this.userService.resetMyAccountPassword(param)
        .subscribe(() => this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE));
    } else {
      console.log(directive);
    }
  }


  sameToPassWord(value: string) {
    return value === this.formData.password;
  }


}
