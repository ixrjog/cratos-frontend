import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../@core/services/user.service';
import { UserVO } from '../../../@core/data/user';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.less']
})
export class UserSettingsComponent implements OnInit {

  username: string;
  user: UserVO = null;

  menus = [
    {
      isActive: true,
      title: 'Base',
    },
    {
      isActive: false,
      title: 'SSH Key',
    },
    {
      isActive: false,
      title: 'Robot',
    },
  ];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.fetchData()
  }

  fetchData() {
    this.userService.getUserByUsername({ username: this.username })
      .subscribe(({ body }) => this.user = body);
  }

  itemClickFn(clickedItem: any) {
    this.menus.forEach((item) => {
      item.isActive = false;
    });
    clickedItem.isActive = true;
  }

  protected readonly fetch = fetch;
}
