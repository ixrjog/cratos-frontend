import { Component, Input } from '@angular/core';
import { UserVO } from '../../../../@core/data/user';

@Component({
  selector: 'app-user-security-settings',
  templateUrl: './user-security-settings.component.html',
  styleUrls: [ './user-security-settings.component.less' ],
})
export class UserSecuritySettingsComponent {

  @Input() user: UserVO;

}
