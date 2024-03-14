import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';

export interface RbacUserRoleVO extends BaseVO {
  id: number;
  username: string;
  roleId: number;
  rbacRole: RbacRoleVO;
}

export interface RbacRoleVO extends BaseVO {
  id: number;
  roleName: string;
  accessLevel: number;
  workOrderVisible: boolean;
  comment: string;
}

export interface RbacGroupVO extends BaseVO {
  id: number;
  groupName: string;
  base: string;
  comment: string;
  resourceCount: Map<string, number>;
}

export interface RbacResourceVO extends BaseVO, ValidVO {
  id: number;
  groupId: number;
  resourceName: string;
  uiPoint: boolean;
  rbacGroup: RbacGroupVO;
  comment: string;
}

export interface RbacResourceEdit {
  id: number;
  groupId: number;
  resourceName: string;
  uiPoint: boolean;
  comment: string;
}

export interface RbacGroupEdit {
  id: number;
  groupName: string;
  base: string;
  comment: string;
}

export interface RbacRoleEdit {
  id?: number;
  roleName: string;
  accessLevel: number;
  workOrderVisible: boolean;
  comment: string;
}

export interface RolePageQuery extends PageQuery {
  roleName: string;
}

export interface GroupPageQuery extends PageQuery {
  queryName: string;
}

export interface ResourcePageQuery extends PageQuery {
  queryName: string;
  valid: boolean;
  groupId: number;
}

export abstract class RbacData {

  abstract queryRolePage(param: RolePageQuery): Observable<DataTable<RbacRoleVO>>;

  abstract queryResourcePage(param: ResourcePageQuery): Observable<DataTable<RbacResourceVO>>;

  abstract queryGroupPage(param: GroupPageQuery): Observable<DataTable<RbacGroupVO>>;

  abstract deleteResourceById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteGroupById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteRoleById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract updateResource(param: RbacResourceEdit): Observable<HttpResult<Boolean>>;

  abstract updateGroup(param: RbacGroupEdit): Observable<HttpResult<Boolean>>;

  abstract setResourceValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract addRole(param: RbacRoleEdit): Observable<HttpResult<Boolean>>;

  abstract updateRole(param: RbacRoleEdit): Observable<HttpResult<Boolean>>;

}
