import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  GroupPageQuery,
  RbacData,
  RbacGroupEdit,
  RbacGroupVO,
  RbacResourceEdit,
  RbacResourceVO,
  RbacRoleVO,
  ResourcePageQuery,
  RolePageQuery,
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

  updateResource(param: RbacResourceEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/rbac/resource/update', param);
  }
  updateGroup(param: RbacGroupEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/rbac/group/update', param);
  }

  setResourceValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam('/rbac/resource/valid/set', param);
  }
}
