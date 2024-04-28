import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { UserEdit, UserVO } from '../../../../@core/data/user';

@Component({
  selector: 'app-user-base-settings',
  templateUrl: './user-base-settings.component.html',
  styleUrls: [ './user-base-settings.component.less' ],
})
export class UserBaseSettingsComponent implements OnChanges {

  @Input() user: UserVO;

  fromData: UserEdit;

  verticalLayout: FormLayout = FormLayout.Vertical;

  ngOnChanges(): void {
    this.fromData = JSON.parse(JSON.stringify(this.user));
  }

}
