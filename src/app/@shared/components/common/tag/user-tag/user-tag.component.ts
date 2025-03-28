import { Component, Input } from '@angular/core';
import { UserVO } from '../../../../../@core/data/user';

@Component({
  selector: 'app-user-tag',
  templateUrl: './user-tag.component.html',
  styleUrls: [ './user-tag.component.less' ],
})
export class UserTagComponent {
  @Input() user: UserVO;
}
