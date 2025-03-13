import { Component, Input } from '@angular/core';
import { EdsCloudAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-user-cloud-identity-card',
  templateUrl: './user-cloud-identity-card.component.html',
  styleUrls: [ './user-cloud-identity-card.component.less' ],
})
export class UserCloudIdentityCardComponent {

  @Input() identity: EdsCloudAccountVO;

}
