import { Component, Input, OnInit } from '@angular/core';
import { EdsLdapAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';
import { EdsIdentityService } from '../../../../../../@core/services/ext-dataSource-identity.service';
import { UserVO } from '../../../../../../@core/data/user';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-ldap-identity',
  templateUrl: './user-ldap-identity.component.html',
  styleUrls: [ './user-ldap-identity.component.less' ],
})
export class UserLdapIdentityComponent implements OnInit {

  @Input() user: UserVO;
  loading: boolean = false;
  ldapIdentities: EdsLdapAccountVO[] = [];

  constructor(private edsIdentityService: EdsIdentityService) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.edsIdentityService.queryLdapIdentityDetails({ username: this.user.username })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(({ body }) => this.ldapIdentities = body.ldapIdentities);
  }

  protected readonly JSON = JSON;
}
