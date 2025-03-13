import { Component, Input, OnInit } from '@angular/core';
import { UserPermissionService } from '../../../../@core/services/user-permission.service';
import { finalize } from 'rxjs';
import { BusinessUserPermissionDetailsVO, UserPermissionBusinessVO } from '../../../../@core/data/user-permission';

@Component({
  selector: 'app-user-permissions-settings',
  templateUrl: './user-permissions-settings.component.html',
  styleUrls: [ './user-permissions-settings.component.less' ],
})
export class UserPermissionsSettingsComponent implements OnInit {

  @Input() username: string;
  loading = false;
  show = false;

  businessPermissions: Map<string, UserPermissionBusinessVO[]>;

  constructor(private userPermissionService: UserPermissionService) {
  }

  fetchData() {
    this.loading = true;
    this.show = false;
    this.userPermissionService.getUserBusinessUserPermissionDetails({ username: this.username })
      .pipe(
        finalize(() => this.loading = false),
      )
      .subscribe(({ body }) => {
        this.businessPermissions = body.businessPermissions;
        this.show = true;
      });
  }

  ngOnInit(): void {
    this.fetchData();
  }
}
