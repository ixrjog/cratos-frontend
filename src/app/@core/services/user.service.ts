import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ResetPassword, UserData, UserEdit, UserPageQuery, UserVO } from '../data/user';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class UserService extends UserData {

  baseUrl = '/user';

  constructor(private apiService: ApiService) {
    super();
  }

  addUser(param: UserEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  queryUserPage(param: UserPageQuery): Observable<DataTable<UserVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  resetUserPassword(param: ResetPassword): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/password/reset', param);
  }

  setUserValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  updateUser(param: UserEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  inactiveUser(param: { id: number }): Observable<HttpResult<Boolean>> {
    return undefined;
  }

  getUserByUsername(param: { username: string }): Observable<HttpResult<UserVO>> {
    return this.apiService.get(this.baseUrl, '/username/get', param);
  }

}
