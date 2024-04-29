import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { UserEdit, UserVO } from '../../../../@core/data/user';
import { UserService } from '../../../../@core/services/user.service';

@Component({
  selector: 'app-user-base-settings',
  templateUrl: './user-base-settings.component.html',
  styleUrls: [ './user-base-settings.component.less' ],
})
export class UserBaseSettingsComponent implements OnChanges {

  constructor(private userService: UserService) {
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
      this.userService.updateUser(param)
        .subscribe(() => this.onFetchData.emit());
    } else {
      console.log(directive);
    }
  }

}
