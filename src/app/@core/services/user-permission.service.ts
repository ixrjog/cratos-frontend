import { Injectable } from '@angular/core';
import { UserPageQuery } from '../data/user';
import { ApiService } from './api.service';
import {
  BusinessUserPermissionDetailsVO,
  GrantUserPermission,
  PermissionBusinessVO,
  QueryAllBusinessUserPermissionDetails,
  RevokeUserPermission,
  UserPermissionBusinessPageQuery, UserPermissionBusinessVO,
  UserPermissionData,
  UserPermissionVO,
} from '../data/user-permission';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class UserPermissionService extends UserPermissionData {

  baseUrl = '/user/permission';

  constructor(private apiService: ApiService) {
    super();
  }

  getUserBusinessUserPermissionDetails(param: {
    username: string
  }): Observable<HttpResult<BusinessUserPermissionDetailsVO>> {
    return this.apiService.get(this.baseUrl, '/details/by/username', param);
  }

  grantUserPermission(param: GrantUserPermission): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/grant', param);
  }

  queryUserPermissionPage(param: UserPageQuery): Observable<DataTable<UserPermissionVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  revokeUserPermission(param: RevokeUserPermission): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/revoke', param);
  }

  revokeUserPermissionById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/revoke/by/id', param);
  }

  queryUserBusinessPermissionPage(param: UserPermissionBusinessPageQuery): Observable<DataTable<PermissionBusinessVO>> {
    return this.apiService.post(this.baseUrl, '/business/page/query', param);
  }

  queryAllBusinessUserPermissionDetails(param: QueryAllBusinessUserPermissionDetails): Observable<HttpResult<{
    userPermissions: UserPermissionBusinessVO[]
  }>> {
    return this.apiService.post(this.baseUrl, '/all/business/details/query', param);
  }

}
