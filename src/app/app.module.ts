import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './@core/core.module';
import { SharedModule } from './@shared/shared.module';
import { Observable, of } from 'rxjs';
import { DatePipe, DevUIModule } from 'ng-devui';
import { I18N } from '../config/language-config';
import { DefaultInterceptor } from './@core/services/default.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

class I18NLoader implements TranslateLoader {
  getTranslation(lang: 'zh-cn' | 'en-us'): Observable<Object> {
    return of(I18N[lang]);
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    DevUIModule,
    MarkdownModule.forRoot(),
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: I18NLoader
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true }, DatePipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
