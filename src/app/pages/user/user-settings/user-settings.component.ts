import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../@core/services/user.service';
import { UserVO } from '../../../@core/data/user';
import { TranslateService } from '@ngx-translate/core';

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
      title: '',
      key: 'user.settings.menu.base'
    },
    {
      isActive: false,
      title: '',
      key: 'user.settings.menu.password'
    },
    {
      isActive: false,
      title: '',
      key: 'user.settings.menu.permissions'
    },
    {
      isActive: false,
      title: '',
      key: 'user.settings.menu.cloudIdentity'
    },
    {
      isActive: false,
      title: '',
      key: 'user.settings.menu.identity'
    },
    {
      isActive: false,
      title: '',
      key: 'user.settings.menu.sshKey'
    },
    {
      isActive: false,
      title: '',
      key: 'user.settings.menu.robot'
    },
  ];

  constructor(
    private userService: UserService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.initializeMenuTitles();
    this.fetchData();
  }

  private initializeMenuTitles(): void {
    this.menus.forEach(menu => {
      menu.title = this.translate.instant(menu.key);
    });
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
