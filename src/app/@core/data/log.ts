import { Observable } from 'rxjs';
import { DataTable, HttpResult } from './base-data';


export interface LoginVo {
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

  abstract login(param: LoginParam): Observable<HttpResult<LoginVo>>;

  abstract logout(): Observable<HttpResult<Boolean>>;
}
