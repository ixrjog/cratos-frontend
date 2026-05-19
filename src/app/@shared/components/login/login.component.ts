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
import { ApiService } from '../../../@core/services/api.service';
import { LoginParam } from '../../../@core/data/log';
import { environment } from '../../../../environments/environment';

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
  isProduction = environment.production;
  hasRobotToken = false;
  loginLoading = false;
  webauthnSupported = !!window.PublicKeyCredential;

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
    private personalizeService: PersonalizeService,
    private apiService: ApiService
  ) {
    this.language = this.translate.currentLang;
  }

  ngOnInit(): void {
    this.formData.username = localStorage.getItem('username') || '';
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
    this.checkRobotToken();

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
        this.loginLoading = true;
        this.logService.login(param)
          .subscribe({
            next: ({ body }) => {
              this.logService.setSession(body);
              this.router.navigate([ '/' ]);
            },
            error: () => {
              this.loginLoading = false;
            },
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

  robotConfig() {
    const currentToken = localStorage.getItem('robotToken') || '';
    const message = currentToken ? 
      `当前Token: ${currentToken.substring(0, 10)}...\n请输入新的Robot Token (留空则清除):` : 
      '请输入Robot Token:';
    
    const token = prompt(message, currentToken);
    if (token !== null) {
      if (token.trim()) {
        localStorage.setItem('robotToken', token.trim());
      } else {
        localStorage.removeItem('robotToken');
      }
      this.checkRobotToken();
    }
  }

  checkRobotToken() {
    this.hasRobotToken = !!localStorage.getItem('robotToken');
  }

  async onBiometricLogin() {
    let username = this.formData.username || localStorage.getItem('username') || '';
    if (!username) {
      alert('Please enter username first');
      return;
    }
    this.loginLoading = true;
    try {
      // 1. Get login options
      const optionsRes: any = await this.apiService.get('/webauthn', '/login/options', { username }).toPromise();
      const options = optionsRes.body;

      // 2. Call WebAuthn API
      const publicKeyOptions: PublicKeyCredentialRequestOptions = {
        challenge: this.base64urlToBuffer(options.challenge),
        rpId: options.rpId,
        allowCredentials: (options.allowCredentials || []).map((c: any) => ({
          type: c.type,
          id: this.base64urlToBuffer(c.id),
          transports: c.transports,
        })),
        userVerification: options.userVerification,
        timeout: options.timeout,
      };

      const assertion = await navigator.credentials.get({ publicKey: publicKeyOptions }) as PublicKeyCredential;
      const authResponse = assertion.response as AuthenticatorAssertionResponse;

      // 3. Send to server
      const body = {
        id: this.bufferToBase64url(assertion.rawId),
        username: username,
        response: {
          authenticatorData: this.bufferToBase64url(authResponse.authenticatorData),
          clientDataJSON: this.bufferToBase64url(authResponse.clientDataJSON),
          signature: this.bufferToBase64url(authResponse.signature),
        },
      };

      const loginRes: any = await this.apiService.post('/webauthn', '/login/complete', body).toPromise();
      const result = loginRes.body;

      // 4. Set session
      this.logService.setSession({
        token: result.token,
        jti: result.jti,
        username: result.username,
        name: result.name || result.username,
        uuid: '',
      });
      this.router.navigate(['/pages']);
    } catch (e: any) {
      console.error('Biometric login failed:', e);
      alert('Biometric login failed: ' + (e?.message || e));
    } finally {
      this.loginLoading = false;
    }
  }

  private base64urlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    const binary = atob(base64 + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  private bufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
