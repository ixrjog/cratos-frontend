import { Component, Input } from '@angular/core';
import { BusinessUserPermissionDetailsVO } from '../../../../@core/data/user-permission';

@Component({
  selector: 'app-business-permissions',
  templateUrl: './business-permissions.component.html',
  styleUrls: [ './business-permissions.component.less' ],
})
export class BusinessPermissionsComponent {

  @Input() permissions: BusinessUserPermissionDetailsVO;

  switch: boolean = true;

  onLabelSwitch() {
    this.switch = !this.switch;
  }

  protected readonly JSON = JSON;
}
