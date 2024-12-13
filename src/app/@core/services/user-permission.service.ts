import { Injectable } from '@angular/core';
import { UserPageQuery } from '../data/user';
import { ApiService } from './api.service';
import {
  BusinessUserPermissionDetailsVO,
  GrantUserPermission,
  QueryBusinessUserPermissionDetails,
  RevokeUserPermission,
  UserPermissionData,
  UserPermissionDetailsVO,
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

  getUserPermissionDetailsByUsername(param: { username: string }): Observable<HttpResult<UserPermissionDetailsVO>> {
    return this.apiService.get(this.baseUrl, '/details/get/by/username', param);
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

  queryBusinessUserPermissionDetails(param: QueryBusinessUserPermissionDetails): Observable<HttpResult<BusinessUserPermissionDetailsVO>> {
    return this.apiService.post(this.baseUrl, '/business/details/query', param);
  }

}
