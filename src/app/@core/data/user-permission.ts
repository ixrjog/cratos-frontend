import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';
import { UserPageQuery } from './user';

export interface UserPermissionVO extends BaseVO, ValidVO {
  id: number;
  username: string;
  name: string;
  displayName: string;
  businessType: string;
  businessId: number;
  role: string;
  seq: number;
  content: string;
  expiredTime: Date;
  comment: string;
}

export interface UserPermissionDetailsVO {
  permissions: Map<string, Map<number, UserMergedPermissionsVO>>;
}

export interface UserMergedPermissionsVO {
  businessType: string;
  businessId: number;
  name: string;
  roles: UserPermissionRoleVO[];
}

export interface UserPermissionRoleVO extends ValidVO {
  role: string;
  seq: number;
  expiredTime: Date;
  comment: string;
}

export interface UserPermissionPageQuery extends PageQuery {
  queryName: string;
  username: string;
  businessType: string;
}

export interface GrantUserPermission {
  username: string;
  name: string;
  displayName: string;
  businessType: string;
  businessId: number;
  role: string;
  valid: boolean;
  seq: number;
  content: string;
  expiredTime: Date;
  comment: string;
}

export interface RevokeUserPermission {
  username: string;
  businessType: string;
  businessId: number;
  role: string;
}

export abstract class UserPermissionData {

  abstract queryUserPermissionPage(param: UserPageQuery): Observable<DataTable<UserPermissionVO>>;

  abstract grantUserPermission(param: GrantUserPermission): Observable<HttpResult<Boolean>>;

  abstract revokeUserPermission(param: RevokeUserPermission): Observable<HttpResult<Boolean>>;

  abstract revokeUserPermissionById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract getUserPermissionDetailsByUsername(param: { username: string }): Observable<HttpResult<UserPermissionDetailsVO>>;

}
