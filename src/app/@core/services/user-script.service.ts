import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DataTable, HttpResult } from '../data/base-data';
import { UserScriptData, UserScriptEdit, UserScriptPageQuery, UserScriptVO } from '../data/user-script';

@Injectable({
  providedIn: 'root',
})
export class UserScriptService extends UserScriptData {

  baseUrl = '/user/script';

  constructor(private apiService: ApiService) {
    super();
  }

  queryUserScriptPage(param: UserScriptPageQuery): Observable<DataTable<UserScriptVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  getUserScriptById(param: { id: number }): Observable<HttpResult<UserScriptVO>> {
    return this.apiService.get(this.baseUrl, '/get', param);
  }

  addUserScript(param: UserScriptEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateUserScript(param: UserScriptEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  deleteUserScriptById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  setUserScriptValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

}
