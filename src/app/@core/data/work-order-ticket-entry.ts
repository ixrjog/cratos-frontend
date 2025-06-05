import { Observable } from 'rxjs';
import { HttpResult, OptionsVO } from './base-data';
import { UserBusinessPermission } from './user-permission';
import { UserVO } from './user';
import { EdsAssetVO, EdsInstanceVO } from './ext-datasource';
import { ApplicationVO } from './application';
import { EdsCloudAccountVO, EdsMailAccountVO } from './ext-dataSource-identity';


export interface AddApplicationPermissionTicketEntry {
  ticketId: number;
  detail: UserBusinessPermission;
}

export interface AddComputerPermissionTicketEntry {
  ticketId: number;
  detail: UserBusinessPermission;
}

export interface AddRevokeUserPermissionTicketEntry {
  ticketId: number;
  detail: UserVO;
}

export interface AddGitLabPermissionTicketEntry {
  ticketId: number;
  detail: GitLabPermission;
}

export interface GitLabPermission {
  target: EdsAssetVO
  role: string
}

export interface AddApplicationElasticScalingTicketEntry {
  ticketId: number;
  detail: {
    application: ApplicationVO;
    namespace: string;
    config: {
      expectedReplicas: number
    };
  };
}

export interface AddDeploymentElasticScalingTicketEntry {
  ticketId: number;
  detail: {
    deployment: EdsAssetVO
    namespace: string;
    expectedReplicas: number
  };
}

export interface AddAliyunDataWorksInstanceTicketEntry {
  ticketId: number;
  detail: {
    edsInstance: EdsInstanceVO
  };
}

export interface AddApplicationDeletePodTicketEntry {
  ticketId: number;
  detail: ApplicationVO;
}

export interface AddCreateAliyunRamUserTicketEntry {
  ticketId: number;
  detail: AliyunRamUserAccount;
}

export interface AddAliyunRamPolicyPermissionTicketEntry {
  ticketId: number;
  detail: AliyunRamPolicy;
}

export interface AliyunRamUserAccount extends CloudIdentityAccount{
}

export interface AliyunRamPolicy extends CloudPolicy {
}

export interface CloudIdentityAccount {
  edsInstance: EdsInstanceVO;
}

export interface CloudPolicy {
  asset: EdsAssetVO;
}

export interface AddResetAliyunRamUserTicketEntry {
  ticketId: number;
  detail: AliyunRamResetAccount;
}

export interface AliyunRamResetAccount extends EdsCloudAccountVO {
  resetPassword: Boolean;
  unbindMFA: Boolean;
}

export interface LdapIdentity {
  asset: EdsAssetVO;
  group: string;
  description?: string;
}

export interface AddLdapRolePermissionTicketEntry {
  ticketId: number;
  detail: LdapIdentity;
}

export interface AddResetAlimailUserTicketEntry {
  ticketId: number;
  detail: EdsMailAccountVO;
}

export interface AddResetAwsIamUserTicketEntry {
  ticketId: number;
  detail: EdsCloudAccountVO;
}

export interface AddCreateAwsTransferSftpUserTicketEntry {
  ticketId: number;
  detail: {
    asset: EdsAssetVO;
    username: string;
    publicKey: string;
    description: string;
  };
}

export interface AddAwsIamPolicyPermissionTicketEntry {
  ticketId: number;
  detail: AwsIamPolicy;
}

export interface AwsIamPolicy extends CloudPolicy {
}

export abstract class WorkOrderTicketEntryData {

  abstract addApplicationPermissionTicketEntry(param: AddApplicationPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addComputerPermissionTicketEntry(param: AddComputerPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addRevokeUserPermissionTicketEntry(param: AddRevokeUserPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract setTicketEntryValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteTicketEntryById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteAllTicketEntryByTicketId(param: { ticketId: number }): Observable<HttpResult<Boolean>>;

  abstract addGitLabProjectPermissionTicketEntry(param: AddGitLabPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addGitLabGroupPermissionTicketEntry(param: AddGitLabPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addElasticScalingOfApplicationReplicasTicketEntry(param: AddApplicationElasticScalingTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addElasticScalingOfDeploymentReplicasTicketEntry(param: AddDeploymentElasticScalingTicketEntry): Observable<HttpResult<Boolean>>;

  abstract queryApplicationResourceDeploymentTicketEntry(param: {
    applicationName: string,
    namespace: string
  }): Observable<HttpResult<Array<EdsAssetVO>>>;

  abstract queryDataWorksInstanceTicketEntry(): Observable<HttpResult<Array<EdsInstanceVO>>>;

  abstract addDataWorksInstanceTicketEntry(param: AddAliyunDataWorksInstanceTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addApplicationDeletePodTicketEntry(param: AddApplicationDeletePodTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addCreateAliyunRamUserTicketEntry(param: AddCreateAliyunRamUserTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addAliyunRamPolicyPermissionTicketEntry(param: AddAliyunRamPolicyPermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addResetAliyunRamUserTicketEntry(param: AddResetAliyunRamUserTicketEntry): Observable<HttpResult<Boolean>>;

  abstract getLdapGroupOptions(): Observable<HttpResult<OptionsVO>>;

  abstract queryLdapRolePermissionTicketEntry(param: { group: string }): Observable<HttpResult<Array<LdapIdentity>>>;

  abstract addLdapRolePermissionTicketEntry(param: AddLdapRolePermissionTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addResetAlimailUserTicketEntry(param: AddResetAlimailUserTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addResetAwsIamUserTicketEntry(param: AddResetAwsIamUserTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addCreateAwsTransferSftpUserTicketEntry(param: AddCreateAwsTransferSftpUserTicketEntry): Observable<HttpResult<Boolean>>;

  abstract addAwsIamPolicyPermissionTicketEntry(param: AddAwsIamPolicyPermissionTicketEntry): Observable<HttpResult<Boolean>>;

}
