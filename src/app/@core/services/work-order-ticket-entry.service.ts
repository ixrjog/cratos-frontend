import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  AddAliyunDataWorksInstanceTicketEntry,
  AddAliyunRamPolicyPermissionTicketEntry,
  AddApplicationDeletePodTicketEntry,
  AddApplicationElasticScalingTicketEntry,
  AddApplicationPermissionTicketEntry,
  AddCreateAliyunRamUserTicketEntry,
  AddDeploymentElasticScalingTicketEntry,
  AddGitLabPermissionTicketEntry,
  AddLdapRolePermissionTicketEntry,
  AddResetAlimailUserTicketEntry,
  AddResetAliyunRamUserTicketEntry,
  AddRevokeUserPermissionTicketEntry,
  LdapIdentity,
  WorkOrderTicketEntryData,
} from '../data/work-order-ticket-entry';
import { Observable } from 'rxjs';
import { HttpResult, OptionsVO } from '../data/base-data';
import { EdsAssetVO, EdsInstanceVO } from '../data/ext-datasource';

@Injectable()
export class WorkOrderTicketEntryService extends WorkOrderTicketEntryData {

  baseUrl = '/workorder/ticket/entry';

  constructor(private apiService: ApiService) {
    super();
  }

  addApplicationPermissionTicketEntry(param: AddApplicationPermissionTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/application/permission/add', param);
  }

  addComputerPermissionTicketEntry(param: AddApplicationPermissionTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/computer/permission/add', param);
  }

  addRevokeUserPermissionTicketEntry(param: AddRevokeUserPermissionTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/user/revoke/permission/add', param);
  }

  setTicketEntryValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  deleteTicketEntryById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del/by/id', param);
  }

  deleteAllTicketEntryByTicketId(param: { ticketId: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del/all/by/ticketId', param);
  }

  addGitLabProjectPermissionTicketEntry(param: AddGitLabPermissionTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/gitlab/project/permission/add', param);
  }

  addGitLabGroupPermissionTicketEntry(param: AddGitLabPermissionTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/gitlab/group/permission/add', param);
  }

  addElasticScalingOfApplicationReplicasTicketEntry(param: AddApplicationElasticScalingTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/application/elastic/scaling/add', param);
  }

  addElasticScalingOfDeploymentReplicasTicketEntry(param: AddDeploymentElasticScalingTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/application/deployment/elastic/scaling/add', param);
  }

  queryApplicationResourceDeploymentTicketEntry(param: {
    applicationName: string,
    namespace: string
  }): Observable<HttpResult<Array<EdsAssetVO>>> {
    return this.apiService.post(this.baseUrl, '/application/resource/deployment/query', param);
  }

  queryDataWorksInstanceTicketEntry(): Observable<HttpResult<Array<EdsInstanceVO>>> {
    return this.apiService.post(this.baseUrl, '/aliyun/dataworks/instance/query', {});
  }

  addDataWorksInstanceTicketEntry(param: AddAliyunDataWorksInstanceTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/aliyun/dataworks/instance/add', param);
  }

  addApplicationDeletePodTicketEntry(param: AddApplicationDeletePodTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/application/pod/delete/add', param);
  }

  addCreateAliyunRamUserTicketEntry(param: AddCreateAliyunRamUserTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/aliyun/ram/user/instance/add', param);
  }

  addAliyunRamPolicyPermissionTicketEntry(param: AddAliyunRamPolicyPermissionTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/aliyun/ram/policy/permission/add', param);
  }

  addResetAliyunRamUserTicketEntry(param: AddResetAliyunRamUserTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/aliyun/ram/user/reset/add', param);
  }

  getLdapGroupOptions(): Observable<HttpResult<OptionsVO>> {
    return this.apiService.get(this.baseUrl, '/ldap/group/options/get', {});
  }

  queryLdapRolePermissionTicketEntry(param: { group: string }): Observable<HttpResult<Array<LdapIdentity>>> {
    return this.apiService.post(this.baseUrl, '/ldap/role/query', param);
  }

  addLdapRolePermissionTicketEntry(param: AddLdapRolePermissionTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/ldap/role/permission/add', param);
  }

  addResetAlimailUserTicketEntry(param: AddResetAlimailUserTicketEntry): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/alimail/user/reset/add', param);
  }

}
