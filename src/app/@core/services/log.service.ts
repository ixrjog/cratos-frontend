import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';
import { LogData, LoginParam, LoginVO } from '../data/log';

@Injectable()
export class LogService extends LogData {

  baseUrl = '/log';

  constructor(private apiService: ApiService) {
    super();
  }

  login(param: LoginParam): Observable<HttpResult<LoginVO>> {
    return this.apiService.post(this.baseUrl, '/login', param);
  }

  logout(): Observable<HttpResult<Boolean>> {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('userinfo');
    return this.apiService.put(this.baseUrl, '/login');
  }


  setSession(userInfo: LoginVO) {
    localStorage.setItem('id_token', userInfo.token);
    localStorage.setItem('userinfo', JSON.stringify(userInfo));
    localStorage.setItem('expires_at', '120');
    localStorage.setItem('username',userInfo.username)
  }

  isUserLoggedIn() {
    return !!localStorage.getItem('userinfo');
  }
}
