import { Observable } from 'rxjs';
import { HttpResult } from './base-data';

export interface LoginVO {
  name: string;
  uuid: string;
  token: string;
}

export interface LoginParam {
  username: string;
  password: string;
  otp?: string;
}

export abstract class LogData {

  abstract login(param: LoginParam): Observable<HttpResult<LoginVO>>;

  abstract logout(): Observable<HttpResult<Boolean>>;
}
