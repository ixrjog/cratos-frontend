import { BaseVO, CommitParam, DataTable, HttpResult, PageQuery, ResourceCountVO, ValidVO } from './base-data';
import { BusinessDocsVO } from './business-doc';
import { BusinessTagsVO } from './business-tag';
import { RbacRoleVO } from './rbac';
import { Observable } from 'rxjs';
import { CredentialVO } from './credential';

export interface UserVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO, ResourceCountVO {
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

export interface RenewalExtUser {
  username: string;
  renewalType: string;
  commit: CommitParam;
}

export abstract class UserData {

  abstract queryUserPage(param: UserPageQuery): Observable<DataTable<UserVO>>;

  abstract updateUser(param: UserEdit): Observable<HttpResult<Boolean>>;

  abstract updateMy(param: UserEdit): Observable<HttpResult<Boolean>>;

  abstract addUser(param: UserEdit): Observable<HttpResult<Boolean>>;

  abstract setUserValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract resetUserPassword(param: ResetPassword): Observable<HttpResult<Boolean>>;

  abstract inactiveUser(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract getUserByUsername(param: { username: string }): Observable<HttpResult<UserVO>>;

  abstract queryMySshKey(): Observable<HttpResult<Array<CredentialVO>>>;

  abstract queryExtUserPage(param: UserPageQuery): Observable<DataTable<UserVO>>;

  abstract renewalOfExtUser(param: RenewalExtUser): Observable<HttpResult<Boolean>>;

  abstract querySshKey(param: { username: string }): Observable<HttpResult<Array<CredentialVO>>>;
}

export enum RenewalExtUserTypeEnum {
  SHORT_TERM = 'SHORT_TERM',
  MID_TERM = 'MID_TERM',
  LONG_TERM = 'LONG_TERM'
}
