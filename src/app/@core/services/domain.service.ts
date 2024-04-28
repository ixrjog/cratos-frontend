import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';
import { DomainData, DomainEdit, DomainPageQuery, DomainVO } from '../data/domian';

@Injectable()
export class DomainService extends DomainData {

  baseUrl = '/domain';

  constructor(private apiService: ApiService) {
    super();
  }

  addDomain(param: DomainEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  deleteDomainById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  queryDomainPage(param: DomainPageQuery): Observable<DataTable<DomainVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  setDomainValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  updateDomain(param: DomainEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

}
