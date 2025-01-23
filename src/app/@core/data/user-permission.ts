import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';
import { UserPageQuery } from './user';
import { EnvVO } from './env';

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
  env: EnvVO;
}

export interface BusinessUserPermissionDetailsVO {
  businessPermissions: Map<string, UserPermissionBusinessVO[]>;
}

export interface UserPermissionBusinessPageQuery extends PageQuery {
  queryName: string;
  businessType: string;
}

export interface UserPermissionBusinessVO {
  businessType: string;
  businessId: number;
  name: string;
  displayName: string;
  userPermissions: UserPermissionVO[];
}

export interface GrantUserPermission {
  username: string;
  businessType: string;
  businessId: number;
  role: string;
}

export interface RevokeUserPermission {
  username: string;
  businessType: string;
  businessId: number;
  role: string;
}

export interface QueryBusinessUserPermissionDetails {
  businessType: string;
  businessId: number;
}

export interface PermissionBusinessVO {
  name: string;
  displayName: string;
  businessType: string;
  businessId: number;
  comment: string;
}

export interface QueryAllBusinessUserPermissionDetails {
  businessType: string;
  username: string;
}

export interface UpdateUserPermissionBusiness {
  username: string;
  businessType: string;
  businessPermissions: {
    businessId: number
    roleMembers: {
      role: string
      checked: boolean
      expiredTime: Date
    }[]
  }[];
}

export abstract class UserPermissionData {

  abstract queryUserPermissionPage(param: UserPageQuery): Observable<DataTable<UserPermissionVO>>;

  abstract queryUserBusinessPermissionPage(param: UserPermissionBusinessPageQuery): Observable<DataTable<PermissionBusinessVO>>;

  abstract grantUserPermission(param: GrantUserPermission): Observable<HttpResult<Boolean>>;

  abstract revokeUserPermission(param: RevokeUserPermission): Observable<HttpResult<Boolean>>;

  abstract revokeUserPermissionById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract getUserBusinessUserPermissionDetails(param: {
    username: string
  }): Observable<HttpResult<BusinessUserPermissionDetailsVO>>;

  abstract queryAllBusinessUserPermissionDetails(param: QueryAllBusinessUserPermissionDetails): Observable<HttpResult<
    {
      userPermissions: UserPermissionBusinessVO[]
    }>>;

  abstract updateUserPermissionBusiness(param: UpdateUserPermissionBusiness): Observable<HttpResult<Boolean>>;
}
