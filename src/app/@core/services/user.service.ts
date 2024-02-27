import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ResetPassword, UserData, UserEdit, UserPageQuery, UserVO } from '../data/user';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class UserService extends UserData {

  constructor(private apiService: ApiService) {
    super();
  }

  addUser(param: UserEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/user/add', param);
  }

  queryUserPage(param: UserPageQuery): Observable<DataTable<UserVO>> {
    return this.apiService.post('/user/page/query', param);
  }

  resetUserPassword(param: ResetPassword): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/user/password/reset', param);
  }

  setUserValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam('/user/valid/set', param);
  }

  updateUser(param: UserEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/user/update', param);
  }

  inactiveUser(param: { id: number }): Observable<HttpResult<Boolean>> {
    return undefined;
  }

}
