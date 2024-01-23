import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';
import { LogData, LoginParam, LoginVo } from '../data/log';

@Injectable()
export class LogService extends LogData {

  constructor(private apiService: ApiService) {
    super();
  }

  login(param: LoginParam): Observable<HttpResult<LoginVo>> {
    return this.apiService.post('/log/login', param);
  }

  logout(): Observable<HttpResult<Boolean>> {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('userinfo');
    return this.apiService.put('/log/login');
  }


  setSession(userInfo: LoginVo) {
    localStorage.setItem('id_token', userInfo.token);
    localStorage.setItem('userinfo', JSON.stringify(userInfo));
    localStorage.setItem('expires_at', '120');
  }

  isUserLoggedIn() {
    return !!localStorage.getItem('userinfo');
  }
}
