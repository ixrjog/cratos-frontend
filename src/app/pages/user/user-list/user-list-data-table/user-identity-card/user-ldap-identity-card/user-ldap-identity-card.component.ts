import { Component, Input } from '@angular/core';
import { EdsGitLabAccountVO, EdsLdapAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-user-ldap-identity-card',
  templateUrl: './user-ldap-identity-card.component.html',
  styleUrls: ['./user-ldap-identity-card.component.less']
})
export class UserLdapIdentityCardComponent {

  @Input() identity: EdsLdapAccountVO;


}
