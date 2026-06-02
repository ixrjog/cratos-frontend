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
import { GlobalNetworkService } from './services/global-network.service';
import { RobotService } from './services/robot.service';
import { KubernetesResourceService } from './services/kubernetes-resource.service';
import { ApplicationService } from './services/application.service';
import { ApplicationResourceService } from './services/application-resource.service';
import { UserPermissionService } from './services/user-permission.service';
import { EdsKubernetesService } from './services/ext-datasource-kubernetes.service';
import { ApplicationResourceBaselineService } from './services/application-resource-baseline.service';
import { CommonService } from './services/common.service';
import { CommandService } from './services/command.service';
import { EdsIdentityService } from './services/ext-dataSource-identity.service';
import { WorkOrderService } from './services/work-order.service';
import { WorkOrderTicketService } from './services/work-order-ticket.service';
import { WorkOrderTicketEntryService } from './services/work-order-ticket-entry.service';
import { TagGroupService } from './services/tag-group.service';
import { CratosInstanceService } from './services/cratos-instance.service';
import { ApplicationCredentialService } from './services/application-credential.service';
import { FinOpsService } from './services/finops.service';
import { UserFavoriteService } from './services/user-favorite.service';
import { TrafficRouteService } from './services/traffic-route.service';
import { AcmeService } from './services/acme.service';
import { ApiSecurityRiskService } from './services/api-security-risk.service';
import { AccountEntityService } from './services/account-entity.service';
import { DatacenterService } from './services/datacenter.service';
import { OrganizationService } from './services/organization.service';
import { ChannelInfoService } from './services/channel-info.service';
import { ChannelBusinessService } from './services/channel-business.service';
import { ChannelNodeService } from './services/channel-line.service';
import { ProjectService } from './services/project.service';

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
  AssetMaturityService,
  GlobalNetworkService,
  RobotService,
  KubernetesResourceService,
  ApplicationService,
  ApplicationResourceService,
  UserPermissionService,
  EdsKubernetesService,
  ApplicationResourceBaselineService,
  CommonService,
  CommandService,
  EdsIdentityService,
  WorkOrderService,
  WorkOrderTicketService,
  WorkOrderTicketEntryService,
  TagGroupService,
  CratosInstanceService,
  ApplicationCredentialService,
  FinOpsService,
  UserFavoriteService,
  TrafficRouteService,
  AcmeService,
  ApiSecurityRiskService,
  AccountEntityService,
  DatacenterService,
  OrganizationService,
  ChannelInfoService,
  ChannelBusinessService,
  ChannelNodeService,
  ProjectService,
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
