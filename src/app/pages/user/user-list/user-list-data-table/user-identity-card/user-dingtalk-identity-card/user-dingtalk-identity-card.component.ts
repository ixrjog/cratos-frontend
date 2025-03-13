import { Component, Input } from '@angular/core';
import { EdsDingtalkAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-user-dingtalk-identity-card',
  templateUrl: './user-dingtalk-identity-card.component.html',
  styleUrls: [ './user-dingtalk-identity-card.component.less' ],
})
export class UserDingtalkIdentityCardComponent {

  @Input() identity: EdsDingtalkAccountVO;

}
