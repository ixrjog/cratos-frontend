import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AlertModule, DatePipe, DCommonModule, DevUIModule, TooltipModule } from 'ng-devui';
import { IconModule } from 'ng-devui/icon';
import { I18nModule } from 'ng-devui/i18n';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { PersonalizeComponent } from './components/personalize/personalize.component';
import { HeaderOperationComponent } from './components/header/header-operation/header-operation.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { DaGridModule } from './layouts/da-grid';
import { HeaderLogoComponent } from './components/header/header-logo/header-logo.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { RegisterComponent } from './components/register/register.component';
import { SafePipe } from './pipe/safePipe';
import { DialogUtil } from './utils/dialog.util';
import { BusinessTagEditorComponent } from './components/business-tag/business-tag-editor/business-tag-editor.component';
import { BusinessTagsComponent } from './components/business-tag/business-tags/business-tags.component';
import { RelativeTimeModule } from 'ng-devui/relative-time';

const DEVUI_MODULES = [
  DevUIModule,
  RelativeTimeModule,
  ReactiveFormsModule,
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  NavbarComponent,
  PersonalizeComponent,
];

const PIPES = [
  SafePipe,
];

const CRATOS_COMPONENTS = [
  BusinessTagEditorComponent,
  BusinessTagsComponent
];

const CRATOS_UTILS = [
  DialogUtil,
];
@NgModule({
  declarations: [
    LoginComponent,
    HeaderOperationComponent,
    HeaderLogoComponent,
    SideMenuComponent,
    RegisterComponent,
    ...COMPONENTS,
    ...PIPES,
    ...CRATOS_COMPONENTS,
    BusinessTagEditorComponent,
    BusinessTagsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    DCommonModule,
    AlertModule,
    ClipboardModule,
    TooltipModule,
    I18nModule,
    IconModule,
    DaGridModule,
    ...DEVUI_MODULES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    HeaderLogoComponent,
    HeaderOperationComponent,
    I18nModule,
    IconModule,
    DaGridModule,
    SideMenuComponent,
    ...DEVUI_MODULES,
    ...COMPONENTS,
    ...PIPES,
    ...CRATOS_COMPONENTS,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [ ...CRATOS_UTILS ],
    };
  }
}
