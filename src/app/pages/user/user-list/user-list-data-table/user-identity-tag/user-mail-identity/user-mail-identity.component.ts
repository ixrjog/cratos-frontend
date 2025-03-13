import { Component, Input, OnInit } from '@angular/core';
import { UserVO } from '../../../../../../@core/data/user';
import { EdsCloudAccountVO, EdsMailAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';
import { EdsIdentityService } from '../../../../../../@core/services/ext-dataSource-identity.service';
import { finalize } from 'rxjs';
import { getPopoverStyle } from 'src/app/@shared/utils/theme.util';

@Component({
  selector: 'app-user-mail-identity',
  templateUrl: './user-mail-identity.component.html',
  styleUrls: ['./user-mail-identity.component.less']
})
export class UserMailIdentityComponent implements OnInit {

  @Input() user: UserVO;
  loading: boolean = false;
  accounts: Map<string, EdsMailAccountVO[]> = new Map;

  constructor(private edsIdentityService: EdsIdentityService) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.edsIdentityService.queryMailIdentityDetails({ username: this.user.username })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(({ body }) => this.accounts = body.accounts);
  }

  protected readonly JSON = JSON;
  getPopoverStyle = getPopoverStyle;
}
