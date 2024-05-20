import { Injectable } from '@angular/core';
import { DomainPageQuery } from '../data/domian';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';
import { ServerAccountData, ServerAccountEdit, ServerAccountPageQuery, ServerAccountVO } from '../data/server-account';

@Injectable()
export class ServerAccountService extends ServerAccountData {

  baseUrl = '/server/account';

  constructor(private apiService: ApiService) {
    super();
  }

  addServerAccount(param: ServerAccountEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  deleteServerAccountById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  queryServerAccountPage(param: ServerAccountPageQuery): Observable<DataTable<ServerAccountVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  setServerAccountValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  updateServerAccount(param: ServerAccountEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

}
