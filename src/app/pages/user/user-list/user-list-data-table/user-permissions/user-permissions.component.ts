import { Component, Input, OnInit } from '@angular/core';
import { BusinessUserPermissionDetailsVO, UserPermissionBusinessVO } from '../../../../../@core/data/user-permission';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: [ './user-permissions.component.less' ],
})
export class UserPermissionsComponent implements OnInit {

  @Input() userPermissions: BusinessUserPermissionDetailsVO;
  permissionMap: Map<string, UserPermissionBusinessVO[]> = new Map();
  protected readonly JSON = JSON;

  ngOnInit(): void {
    if (this.userPermissions === null) {
      return;
    }
    const map = new Map(Object.entries(this.userPermissions));
    map.forEach((value, key) => {
      this.permissionMap.set(key, value);
    });
  }

}

