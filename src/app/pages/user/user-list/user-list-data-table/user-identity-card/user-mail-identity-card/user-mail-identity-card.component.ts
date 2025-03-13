import { Component, Input } from '@angular/core';
import { EdsCloudAccountVO, EdsMailAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-user-mail-identity-card',
  templateUrl: './user-mail-identity-card.component.html',
  styleUrls: ['./user-mail-identity-card.component.less']
})
export class UserMailIdentityCardComponent {

  @Input() identity: EdsMailAccountVO;

}
