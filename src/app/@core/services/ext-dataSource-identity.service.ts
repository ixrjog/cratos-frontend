import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  AddLdapUserToTheGroup,
  CreateLdapIdentity,
  DeleteLdapIdentity,
  EdsCloudIdentityDetailsVO,
  EdsDingtalkIdentityDetailsVO,
  EdsGitLabIdentityDetailsVO,
  EdsIdentityData,
  EdsLdapIdentityDetailsVO,
  LdapIdentity,
  RemoveLdapUserFromGroup,
  ResetLdapUserPassword,
} from '../data/ext-dataSource-identity';

@Injectable()
export class EdsIdentityService extends EdsIdentityData {

  baseUrl = '/eds/identity';

  constructor(private apiService: ApiService) {
    super();
  }

  queryCloudIdentityDetails(param: {
    username: string,
    instanceType?: string,
    instanceId?: number
  }): Observable<HttpResult<EdsCloudIdentityDetailsVO>> {
    return this.apiService.post(this.baseUrl, '/cloud/details/query', param);
  }

  queryLdapIdentityDetails(param: {
    username: string,
    instanceId?: number
  }): Observable<HttpResult<EdsLdapIdentityDetailsVO>> {
    return this.apiService.post(this.baseUrl, '/ldap/details/query', param);
  }

  queryDingtalkIdentityDetails(param: {
    username: string,
    instanceId?: number
  }): Observable<HttpResult<EdsDingtalkIdentityDetailsVO>> {
    return this.apiService.post(this.baseUrl, '/dingtalk/details/query', param);
  }

  queryGitLabIdentityDetails(param: {
    username: string,
    instanceId?: number
  }): Observable<HttpResult<EdsGitLabIdentityDetailsVO>> {
    return this.apiService.post(this.baseUrl, '/gitlab/details/query', param);
  }

  addLdapUserToTheGroup(param: AddLdapUserToTheGroup): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/ldap/user/addToGroup', param);
  }

  createLdapIdentity(param: CreateLdapIdentity): Observable<HttpResult<LdapIdentity>> {
    return this.apiService.post(this.baseUrl, '/ldap/user/create', param);
  }

  removeLdapUserFromGroup(param: RemoveLdapUserFromGroup): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/ldap/user/removeFromGroup', param);
  }

  resetLdapUserPassword(param: ResetLdapUserPassword): Observable<HttpResult<LdapIdentity>> {
    return this.apiService.put(this.baseUrl, '/ldap/user/password/reset', param);
  }

  deleteLdapIdentity(param: DeleteLdapIdentity): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/ldap/user/delete', param);
  }

}
