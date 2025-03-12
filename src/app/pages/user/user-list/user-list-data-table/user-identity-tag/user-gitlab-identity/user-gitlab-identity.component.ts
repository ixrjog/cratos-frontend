import { Component, Input, OnInit } from '@angular/core';
import { UserVO } from '../../../../../../@core/data/user';
import { EdsGitLabAccountVO } from '../../../../../../@core/data/ext-dataSource-identity';
import { EdsIdentityService } from '../../../../../../@core/services/ext-dataSource-identity.service';
import { finalize } from 'rxjs';
import { getPopoverStyle } from '../../../../../../@shared/utils/theme.util';

@Component({
  selector: 'app-user-gitlab-identity',
  templateUrl: './user-gitlab-identity.component.html',
  styleUrls: [ './user-gitlab-identity.component.less' ],
})
export class UserGitlabIdentityComponent implements OnInit {

  @Input() user: UserVO;
  loading: boolean = false;
  gitLabIdentities: EdsGitLabAccountVO[] = [];

  constructor(private edsIdentityService: EdsIdentityService) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.edsIdentityService.queryGitLabIdentityDetails({ username: this.user.username })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(({ body }) => this.gitLabIdentities = body.gitLabIdentities);
  }

  protected readonly JSON = JSON;
  protected readonly getPopoverStyle = getPopoverStyle;
}
