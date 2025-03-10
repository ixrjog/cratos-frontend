import { Component, Input, OnInit } from '@angular/core';
import { UserVO } from '../../../../../../@core/data/user';
import { finalize } from 'rxjs';
import { UserService } from '../../../../../../@core/services/user.service';
import { RELATIVE_TIME_LIMIT } from '../../../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-user-ssh-key-identity',
  templateUrl: './user-ssh-key-identity.component.html',
  styleUrls: [ './user-ssh-key-identity.component.less' ],
})
export class UserSshKeyIdentityComponent implements OnInit {
  @Input() user: UserVO;
  loading: boolean = false;
  sshKeys = [];
  hostUrl: string;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.hostUrl = window.location.hostname;
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.userService.querySshKey({ username: this.user.username })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(({ body }) => this.sshKeys = body);
  }

  protected readonly JSON = JSON;
  protected readonly limit = RELATIVE_TIME_LIMIT;
}
