import { Component, Input } from '@angular/core';
import { UserPermissionBusinessVO } from '../../../../@core/data/user-permission';

@Component({
  selector: 'app-business-permissions',
  templateUrl: './business-permissions.component.html',
  styleUrls: [ './business-permissions.component.less' ],
})
export class BusinessPermissionsComponent {

  @Input() permissions: Map<string, UserPermissionBusinessVO[]>;

  protected readonly JSON = JSON;
}
