import { Component, Input, OnInit } from '@angular/core';
import { UserVO } from '../../../../@core/data/user';
import { UserService } from '../../../../@core/services/user.service';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: [ './user-info-card.component.less' ],
})
export class UserInfoCardComponent implements OnInit {

  @Input() user: UserVO;
  @Input() username: string;
  show = false;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    if (this.username) {
      this.userService.getUserByUsername({ username: this.username }).subscribe(({ body }) => {
        this.user = body;
        this.show = true;
      });
    } else {
      this.show = true;
    }
  }

  protected readonly JSON = JSON;
}
