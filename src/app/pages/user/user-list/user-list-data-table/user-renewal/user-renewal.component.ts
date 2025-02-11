import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { UserService } from '../../../../../@core/services/user.service';
import { RenewalExtUser, RenewalExtUserTypeEnum, UserVO } from '../../../../../@core/data/user';

@Component({
  selector: 'app-user-renewal',
  templateUrl: './user-renewal.component.html',
  styleUrls: [ './user-renewal.component.less' ],
})
export class UserRenewalComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: UserVO;
  renewalType: string = RenewalExtUserTypeEnum.SHORT_TERM;
  commitMsg: string = '';
  renewalOfAll: boolean = false;

  renewalTypeOptions = [
    RenewalExtUserTypeEnum.SHORT_TERM,
    RenewalExtUserTypeEnum.MID_TERM,
    RenewalExtUserTypeEnum.LONG_TERM,
  ];

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
  };

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  updateForm() {
    const param: RenewalExtUser = {
      username: this.formData.username,
      renewalType: this.renewalType,
      renewalOfAll: this.renewalOfAll,
      commit: {
        message: this.commitMsg,
      },
    };
    return this.userService.renewalOfExtUser(param);
  }

}
