import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { UserEdit, UserVO } from '../../../../@core/data/user';
import { UserService } from '../../../../@core/services/user.service';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { DialogUtil } from '../../../../@shared/utils/dialog.util';
import { BusinessTypeEnum } from '../../../../@core/data/business';

@Component({
  selector: 'app-user-base-settings',
  templateUrl: './user-base-settings.component.html',
  styleUrls: [ './user-base-settings.component.less' ],
})
export class UserBaseSettingsComponent implements OnChanges {

  constructor(private userService: UserService,
              private dialogUtil: DialogUtil) {
  }

  @Input() user: UserVO;
  @Output() onFetchData = new EventEmitter<any>();
  fromData: UserEdit;
  verticalLayout: FormLayout = FormLayout.Vertical;

  ngOnChanges(): void {
    this.fromData = JSON.parse(JSON.stringify(this.user));
  }

  submitForm({ valid, directive }) {
    if (valid) {
      const param: UserEdit = {
        ...this.fromData,
      };
      this.userService.updateMy(param)
        .subscribe(() => this.onFetchData.emit());
    } else {
      console.log(directive);
    }
  }

  onRowBusinessTag(rowItem: UserVO) {
    this.dialogUtil.onBusinessTagEditDialog(BusinessTypeEnum.USER, rowItem, () => this.onFetchData.emit());
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;
}
