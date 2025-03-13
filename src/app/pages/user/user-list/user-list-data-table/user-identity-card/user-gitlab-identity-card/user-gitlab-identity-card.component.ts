import { Component, Input } from '@angular/core';
import { EdsGitLabAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-user-gitlab-identity-card',
  templateUrl: './user-gitlab-identity-card.component.html',
  styleUrls: ['./user-gitlab-identity-card.component.less']
})
export class UserGitlabIdentityCardComponent {

  @Input() identity: EdsGitLabAccountVO;

}
