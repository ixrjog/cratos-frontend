import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { BusinessDocsVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { RbacRoleVO } from './rbac';
import { Observable } from 'rxjs';

export interface UserVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  uuid: string;
  username: string;
  name: string;
  displayName: string;
  email: string;
  mobilePhone: string;
  otp: number;
  createdBy: string;
  source: string;
  lastLogin: Date;
  comment: string;
  expiredTime: Date;
  rbacRoles: RbacRoleVO[];
  resourceCount: Map<string, number>;
}

export interface UserPageQuery extends PageQuery {
  queryName: string;
}

export interface UserEdit {
  id?: number;
  username: string;
  name: string;
  displayName: string;
  email: string;
  mobilePhone: string;
  otp: number;
  comment: string;
  expiredTime: Date;
  valid: boolean;
  fromAssetId?: number;
}

export interface ResetPassword {
  username: string;
  password: string;
}

export interface UpdatePassword {
  password: string;
}

export abstract class UserData {

  abstract queryUserPage(param: UserPageQuery): Observable<DataTable<UserVO>>;

  abstract updateUser(param: UserEdit): Observable<HttpResult<Boolean>>;

  abstract addUser(param: UserEdit): Observable<HttpResult<Boolean>>;

  abstract setUserValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract resetUserPassword(param: ResetPassword): Observable<HttpResult<Boolean>>;

  abstract inactiveUser(param: { id: number }): Observable<HttpResult<Boolean>>;

}
