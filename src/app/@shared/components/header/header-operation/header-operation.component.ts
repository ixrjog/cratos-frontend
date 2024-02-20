import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/@core/services/auth.service';
import { LANGUAGES } from 'src/config/language-config';
import { User } from '../../../models/user';
import { I18nService } from 'ng-devui/i18n';
import { LoginVO } from '../../../../@core/data/log';
import { LogService } from '../../../../@core/services/log.service';

@Component({
  selector: 'da-header-operation',
  templateUrl: './header-operation.component.html',
  styleUrls: ['./header-operation.component.scss'],
})
export class HeaderOperationComponent implements OnInit {
  user: LoginVO;
  languages = LANGUAGES;
  language: string;
  haveLoggedIn = false;

  constructor(
    private route: Router,
    private logService: LogService,
    private translate: TranslateService,
    private i18n: I18nService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('userinfo')) {
      this.user = JSON.parse(localStorage.getItem('userinfo')!);
      this.haveLoggedIn = true;
    // } else {
    //   this.authService.login('Admin', '******').subscribe((res) => {
    //     this.authService.setSession(res);
    //     this.user = JSON.parse(localStorage.getItem('userinfo')!);
    //     this.haveLoggedIn = true;
    //   });
    }

    this.language = this.translate.currentLang;
  }

  onSearch(event: any) {
    console.log(event);
  }

  onLanguageClick(language: string) {
    this.language = language;
    localStorage.setItem('lang', this.language);
    this.i18n.toggleLang(this.language);
    this.translate.use(this.language);
  }

  handleUserOps(operation: string) {
    switch (operation) {
      case 'logout': {
        this.haveLoggedIn = false;
        this.logService.logout();
        this.route.navigate(['/', 'login']);
        break;
      }
      default:
        break;
    }
  }
}
