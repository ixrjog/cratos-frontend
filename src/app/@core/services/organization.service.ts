import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';
import { ApiService } from './api.service';
import { OrganizationData, OrganizationEdit, OrganizationPageQuery, OrganizationVO } from '../data/organization';

@Injectable()
export class OrganizationService extends OrganizationData {

  baseUrl = '/channel/organization';

  constructor(private apiService: ApiService) {
    super();
  }

  queryOrganizationPage(param: OrganizationPageQuery): Observable<DataTable<OrganizationVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  addOrganization(param: OrganizationEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateOrganization(param: OrganizationEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  deleteOrganizationById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  setOrganizationValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }
}
