import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { I18nService } from 'ng-devui/i18n';
import { Subject } from 'rxjs';
import { DValidateRules } from 'ng-devui';
import { map, takeUntil } from 'rxjs/operators';
import { PersonalizeService } from 'src/app/@core/services/personalize.service';
import { ThemeType } from '../../models/theme';
import { FormLayout } from 'ng-devui/form';
import { LANGUAGES } from 'src/config/language-config';
import { LogService } from '../../../@core/services/log.service';
import { LoginParam } from '../../../@core/data/log';

@Component({
  selector: 'da-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  tabActiveId: string | number = 'tab1';
  showPassword = false;
  horizontalLayout: FormLayout = FormLayout.Vertical;

  toastMessage: any;
  languages = LANGUAGES;
  language: string;
  tabItems: any;
  i18nValues: any;

  formData: LoginParam = {
    otp: '', password: '', username: '',
  };

  formRules: { [key: string]: DValidateRules } = {
    usernameRules: {
      validators: [
        { required: true },
        // { minlength: 3 },
        // { maxlength: 20 },
        // {
        //   pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/,
        //   message: 'The user name cannot contain characters except uppercase and lowercase letters.',
        // },
      ]
    },
    passwordRules: {
      validators: [
        // { required: true },
        // { minlength: 6 },
        // { maxlength: 100 },
        // {
        //   pattern: /^[a-zA-Z0-9\d@$!%*?&.]+(\s+[a-zA-Z0-9]+)*$/,
        // },
      ],
      // message: 'Enter a password that contains 6 to 15 digits and letters.',
    },
  };

  @HostListener('window:keydown.enter')
  onEnter() {
    this.onClick(this.tabActiveId);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private logService: LogService,
    private translate: TranslateService,
    private i18n: I18nService,
    private personalizeService: PersonalizeService
  ) {
    this.language = this.translate.currentLang;
  }

  ngOnInit(): void {
    this.translate
      .get('loginPage')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.i18nValues = this.translate.instant('loginPage');
        this.updateTabItems(res);
      });

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: TranslationChangeEvent) => {
        this.i18nValues = this.translate.instant('loginPage');
        this.updateTabItems(this.i18nValues);
      });
    this.language = this.translate.currentLang;
    this.personalizeService.setRefTheme(ThemeType.Default);

    this.route.queryParams.pipe(
      map(param => param['code'])
    ).subscribe(code => {
      if(code && code.length > 0) {
        setTimeout(() => {
          this.toastMessage = [
            {
              severity: 'success',
              content: this.i18nValues['callbackMessage'],
            },
          ];
        });
      }
    });
  }

  onClick(tabId: string | number) {
    switch (tabId) {
      case 'tab1':
        const param: LoginParam = {
          ...this.formData,
        };
        this.logService.login(param)
          .subscribe(
            ({ body }) => {
              this.logService.setSession(body);
              this.router.navigate([ '/' ]);
            });
        break;
      default:
        break;
    }
  }

  onLanguageClick(language: string) {
    this.language = language;
    localStorage.setItem('lang', this.language);
    this.i18n.toggleLang(this.language);
    this.translate.use(this.language);
  }

  updateTabItems(values: any) {
    this.tabItems = [
      {
        id: 'tab1',
        title: values['loginWays']['account']
      },
      // {
      //   id: 'tab2',
      //   title: values['loginWays']['email']
      // }
    ];
  }

  onKeyUp(e: KeyboardEvent, tabId: string | number) {
    if (e.keyCode === 13) {
      this.onClick(tabId);
    }
  }

  handleAuth(type: string){
    console.log(type);
    const config = {
      oauth_uri: 'https://github.com/login/oauth/authorize',
      redirect_uri: 'https://devui.design/admin/login',
      client_id: 'ef3ce924fcf915c50910'
    };
    window.location.href = `${config.oauth_uri}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}`
  }
}
