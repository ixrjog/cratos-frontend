import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ThemeServiceInit, devuiDarkTheme, Theme } from 'ng-devui/theme';
import { AppModule } from './app/app.module';

import {
  infinityTheme,
  sweetTheme,
  provenceTheme,
  deepTheme
} from 'ng-devui/theme-collection';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const customTheme = new Theme({
  id: `customize-theme`,
  name: 'custom',
  cnName: '自定义主题',
  data: {},
  isDark: false
});

ThemeServiceInit({
  infinityTheme,
  sweetTheme,
  provenceTheme,
  deepTheme,
  devuiDarkTheme,
  customTheme
});

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  document.body.classList.add('is-mobile');
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
