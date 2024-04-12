import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  GroupPageQuery,
  RbacData,
  RbacGroupEdit,
  RbacGroupVO,
  RbacResourceEdit,
  RbacResourceVO,
  RbacRoleEdit,
  RbacRoleVO,
  ResourcePageQuery,
  RolePageQuery,
  RoleResourceEdit,
  RoleResourcePageQuery,
  SaveRoleMenu,
  UserRoleEdit,
} from '../data/rbac';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class RbacService extends RbacData {

  baseUrl = '/rbac';

  constructor(private apiService: ApiService) {
    super();
  }

  queryResourcePage(param: ResourcePageQuery): Observable<DataTable<RbacResourceVO>> {
    return this.apiService.post(this.baseUrl, '/resource/page/query', param);
  }

  queryGroupPage(param: GroupPageQuery): Observable<DataTable<RbacGroupVO>> {
    return this.apiService.post(this.baseUrl, '/group/page/query', param);
  }

  queryRolePage(param: RolePageQuery): Observable<DataTable<RbacRoleVO>> {
    return this.apiService.post(this.baseUrl, '/role/page/query', param);
  }

  deleteResourceById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/resource/del', param);
  }

  deleteGroupById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/group/del', param);
  }

  deleteRoleById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/role/del', param);
  }

  updateResource(param: RbacResourceEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/resource/update', param);
  }
  updateGroup(param: RbacGroupEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/group/update', param);
  }

  setResourceValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/resource/valid/set', param);
  }

  updateRole(param: RbacRoleEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/role/update', param);
  }

  addRole(param: RbacRoleEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/role/add', param);
  }

  queryRoleResourcePage(param: RoleResourcePageQuery): Observable<DataTable<RbacResourceVO>> {
    return this.apiService.post(this.baseUrl, '/role/resource/page/query', param);
  }

  addRoleResource(param: RoleResourceEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/role/resource/add', param);
  }

  deleteRoleResource(param: RoleResourceEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.deleteByBody(this.baseUrl, '/role/resource/del', param);
  }

  addUserRole(param: UserRoleEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/user/role/add', param);
  }

  deleteUserRole(param: UserRoleEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.deleteByBody(this.baseUrl, '/user/role/del', param);
  }

  saveRoleMenu(param: SaveRoleMenu): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/role/menu/save', param);
  }

}
