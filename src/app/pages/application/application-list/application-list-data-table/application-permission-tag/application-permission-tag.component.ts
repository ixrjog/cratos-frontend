import { Component, Input } from '@angular/core';
import { UserPermissionBusinessVO } from '../../../../../@core/data/user-permission';

@Component({
  selector: 'app-application-permission-tag',
  templateUrl: './application-permission-tag.component.html',
  styleUrls: ['./application-permission-tag.component.less']
})
export class ApplicationPermissionTagComponent {

  @Input() permissions: Map<string, UserPermissionBusinessVO[]>;

  protected readonly JSON = JSON;

}
