import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

export interface ProjectVO {
  id: number;
  key: string;
  name: string;
  valid: boolean;
  comment: string;
  createTime: Date;
  updateTime: Date;
}

export interface ProjectTenantVO {
  id: number;
  projectId: number;
  project: ProjectVO;
  tenantCode: string;
  countryCode: string;
  name: string;
  docs: string;
  valid: boolean;
  comment: string;
  createTime: Date;
  updateTime: Date;
}

export interface ProjectPageQuery {
  queryName: string;
  page: number;
  length: number;
}

@Injectable()
export class ProjectService {

  baseUrl = '/project';

  constructor(private apiService: ApiService) {
  }

  queryProjectPage(param: ProjectPageQuery): Observable<DataTable<ProjectVO>> {
    return this.apiService.post(this.baseUrl, '/config/page/query', param);
  }

  addProject(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/config/add', param);
  }

  updateProject(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/config/update', param);
  }

  deleteProject(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/config/del', param);
  }

  queryProjectTenantPage(param: ProjectPageQuery): Observable<DataTable<ProjectTenantVO>> {
    return this.apiService.post(this.baseUrl, '/tenant/page/query', param);
  }

  addProjectTenant(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/tenant/add', param);
  }

  updateProjectTenant(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/tenant/update', param);
  }

  deleteProjectTenant(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/tenant/del', param);
  }

  addProjectLoadBalancer(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/lb/add', param);
  }

  updateProjectLoadBalancer(param: any): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/lb/update', param);
  }

  deleteProjectLoadBalancer(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/lb/del', param);
  }

  queryLoadBalancersByTenantId(tenantId: number): Observable<any> {
    return this.apiService.get(this.baseUrl, '/lb/query', { tenantId });
  }

  getLbTypeOptions(): Observable<any> {
    return this.apiService.get(this.baseUrl, '/lb/type/options/get', {});
  }

  getMemberTypeOptions(): Observable<any> {
    return this.apiService.get(this.baseUrl, '/member/type/options/get', {});
  }

  queryGroupsByTenantId(tenantId: number): Observable<any> {
    return this.apiService.get(this.baseUrl, '/group/query', { tenantId });
  }

  addProjectGroup(param: any): Observable<any> {
    return this.apiService.post(this.baseUrl, '/group/add', param);
  }

  updateProjectGroup(param: any): Observable<any> {
    return this.apiService.put(this.baseUrl, '/group/update', param);
  }

  deleteProjectGroup(param: { id: number }): Observable<any> {
    return this.apiService.delete(this.baseUrl, '/group/del', param);
  }

  addProjectGroupMember(param: any): Observable<any> {
    return this.apiService.post(this.baseUrl, '/group/member/add', param);
  }

  deleteProjectGroupMember(param: { id: number }): Observable<any> {
    return this.apiService.delete(this.baseUrl, '/group/member/del', param);
  }
}
