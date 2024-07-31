import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { PersonalizeService } from './services/personalize.service';
import { CustomThemeService } from './services/custom-theme.service';
import { CourseData } from './data/course';
import { CourseService } from './mock/course.service';
import { MockDataModule } from './mock/mock-data.module';
import { AuthGuardService } from './services/auth-guard-service.guard';
import { CertificateService } from './services/certificate.service';
import { TagService } from './services/tag.service';
import { CredentialService } from './services/credential.service';
import { ToastModule } from 'ng-devui';
import { LogService } from './services/log.service';
import { BusinessTagService } from './services/business-tag.service';
import { BusinessDocService } from './services/business-doc.service';
import { ChannelNetworkService } from './services/channel-network.service';
import { UserService } from './services/user.service';
import { RbacService } from './services/rbac.service';
import { EdsService } from './services/ext-datasource.service.s';
import { EdsScheduleService } from './services/ext-datasource-schedule.service';
import { EnvService } from './services/env.service';
import { TrafficLayerService } from './services/traffic-layer.service';
import { MenuService } from './services/menu.service';
import { RiskEventService } from './services/risk-event.service';
import { DomainService } from './services/domain.service';
import { WebSocketApiService } from './services/ws.api.service';
import { ServerAccountService } from './services/server-account.service';
import { SshSessionService } from './services/ssh-session.service';
import { NotificationTemplateService } from './services/notification-template.service';
import { AssetMaturityService } from './services/asset-maturity.service';

const DATA_SERVICES = [
  { provide: CourseData, useClass: CourseService },
];

export const DEVUI_CORE_PROVIDERS = [
  ...MockDataModule.forRoot().providers!,
  ...DATA_SERVICES,
  PersonalizeService,
  AuthGuardService,
  CustomThemeService,
];

export const CRATOS_PROVIDERS = [
  CertificateService,
  CredentialService,
  TagService,
  LogService,
  BusinessTagService,
  BusinessDocService,
  ChannelNetworkService,
  UserService,
  RbacService,
  EdsService,
  EdsScheduleService,
  EnvService,
  TrafficLayerService,
  MenuService,
  RiskEventService,
  DomainService,
  ServerAccountService,
  SshSessionService,
  NotificationTemplateService,
  AssetMaturityService
];

export const WS_CRATOS_PROVIDERS = [
  WebSocketApiService,
];

@NgModule({
  declarations: [],
  imports: [ CommonModule,ToastModule ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...DEVUI_CORE_PROVIDERS,
        ...CRATOS_PROVIDERS,
        ...WS_CRATOS_PROVIDERS,
      ],
    };
  }
}
