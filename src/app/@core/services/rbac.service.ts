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
  UserRoleEdit,
} from '../data/rbac';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class RbacService extends RbacData {

  constructor(private apiService: ApiService) {
    super();
  }

  queryResourcePage(param: ResourcePageQuery): Observable<DataTable<RbacResourceVO>> {
    return this.apiService.post('/rbac/resource/page/query', param);
  }

  queryGroupPage(param: GroupPageQuery): Observable<DataTable<RbacGroupVO>> {
    return this.apiService.post('/rbac/group/page/query', param);
  }

  queryRolePage(param: RolePageQuery): Observable<DataTable<RbacRoleVO>> {
    return this.apiService.post('/rbac/role/page/query', param);
  }

  deleteResourceById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/rbac/resource/del', param);
  }

  deleteGroupById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/rbac/group/del', param);
  }

  deleteRoleById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/rbac/role/del', param);
  }

  updateResource(param: RbacResourceEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/rbac/resource/update', param);
  }
  updateGroup(param: RbacGroupEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/rbac/group/update', param);
  }

  setResourceValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam('/rbac/resource/valid/set', param);
  }

  addRole(param: RbacRoleEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/rbac/role/update', param);
  }

  updateRole(param: RbacRoleEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/rbac/role/add', param);
  }

  queryRoleResourcePage(param: RoleResourcePageQuery): Observable<DataTable<RbacResourceVO>> {
    return this.apiService.post('/rbac/role/resource/page/query', param);
  }

  addRoleResource(param: RoleResourceEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/rbac/role/resource/add', param);
  }

  deleteRoleResource(param: RoleResourceEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.deleteByBody('/rbac/role/resource/del', param);
  }

  addUserRole(param: UserRoleEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/rbac/user/role/add', param);
  }

  deleteUserRole(param: UserRoleEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.deleteByBody('/rbac/user/role/del', param);
  }

}
