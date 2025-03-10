import { Component, Input, OnInit } from '@angular/core';
import { EdsIdentityService } from '../../../../../../@core/services/ext-dataSource-identity.service';
import { UserVO } from '../../../../../../@core/data/user';
import { finalize } from 'rxjs';
import { EdsCloudAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-user-cloud-identity',
  templateUrl: './user-cloud-identity.component.html',
  styleUrls: [ './user-cloud-identity.component.less' ],
})
export class UserCloudIdentityComponent implements OnInit {

  @Input() user: UserVO;
  loading: boolean = false;
  accounts: Map<string, EdsCloudAccountVO[]> = new Map;

  constructor(private edsIdentityService: EdsIdentityService) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.edsIdentityService.queryCloudIdentityDetails({ username: this.user.username })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(({ body }) => this.accounts = body.accounts);
  }

  protected readonly JSON = JSON;
}
