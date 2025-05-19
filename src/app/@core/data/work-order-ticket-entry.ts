import { Observable } from 'rxjs';
import { HttpResult } from './base-data';
import { UserBusinessPermission } from './user-permission';
import { UserVO } from './user';
import { EdsAssetVO, EdsInstanceVO } from './ext-datasource';
import { ApplicationVO } from './application';


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

export interface AliyunRamUserAccount extends CloudIdentityAccount{
}

export interface CloudIdentityAccount {
  edsInstance: EdsInstanceVO;
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
}
