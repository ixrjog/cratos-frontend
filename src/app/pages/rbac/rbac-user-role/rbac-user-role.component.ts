import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-rbac-user-role',
  templateUrl: './rbac-user-role.component.html',
  styleUrls: ['./rbac-user-role.component.less']
})
export class RbacUserRoleComponent implements AfterViewInit {
  constructor() {
  }

  ngAfterViewInit(): void {
    window.dispatchEvent(new Event('resize'));
  }
}
