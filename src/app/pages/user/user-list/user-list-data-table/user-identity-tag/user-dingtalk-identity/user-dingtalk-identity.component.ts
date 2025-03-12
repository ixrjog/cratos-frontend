import { Component, Input, OnInit } from '@angular/core';
import { UserVO } from '../../../../../../@core/data/user';
import { EdsDingtalkAccountVO, EdsGitLabAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';
import { EdsIdentityService } from '../../../../../../@core/services/ext-dataSource-identity.service';
import { finalize } from 'rxjs';
import { getPopoverStyle } from '../../../../../../@shared/utils/theme.util';

@Component({
  selector: 'app-user-dingtalk-identity',
  templateUrl: './user-dingtalk-identity.component.html',
  styleUrls: ['./user-dingtalk-identity.component.less']
})
export class UserDingtalkIdentityComponent implements OnInit {

  @Input() user: UserVO;
  loading: boolean = false;
  dingtalkIdentities: EdsDingtalkAccountVO[] = [];

  constructor(private edsIdentityService: EdsIdentityService) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.edsIdentityService.queryDingtalkIdentityDetails({ username: this.user.username })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(({ body }) => this.dingtalkIdentities = body.dingtalkIdentities);
  }

  protected readonly JSON = JSON;
  protected readonly getPopoverStyle = getPopoverStyle;
}
