import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = '/api';

  constructor(private http: HttpClient) {
  }

  get(url: string, params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}${url}` + this.initGetParams(params), { headers: this.headers });
  }

  post(url: string, data: object = {}): Observable<any> {
    return this.http.post(`${this.apiUrl}${url}`, JSON.stringify(data), { headers: this.headers });
  }

  put(url: string, data: object = {}): Observable<any> {
    return this.http.put(`${this.apiUrl}${url}`, JSON.stringify(data), { headers: this.headers });
  }

  putByParam(url: string, params: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${url}` + this.initGetParams(params), {}, { headers: this.headers });
  }

  delete(url: string, params: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}${url}` + this.initGetParams(params), { headers: this.headers });
  }

  deleteByBody(url: string, data: object = {}): Observable<any> {
    return this.http.delete(`${this.apiUrl}${url}`, { body: JSON.stringify(data), headers: this.headers });
  }

  get headers(): HttpHeaders {
    const headersConfig: any = {
      'Content-Type': 'application/json',
      // 'Authorization': token ? token: ''
    };
    let token = localStorage.getItem('id_token');
    if (token) {
      headersConfig['Authorization'] = token
    }
    return new HttpHeaders(headersConfig);
  }

  initGetParams(queryParams: any) {
    const paramsKey = Object.keys(queryParams);
    const paramsUrl = paramsKey.map((item: any) => {
      if (queryParams[item]) {
        return `${item}=${queryParams[item]}`;
      }
      return '';
    }).filter(item => item !== '' && item !== undefined && item !== null).join('&');
    if (paramsUrl !== '') {
      return `?${paramsUrl}`;
    } else {
      return '';
    }
  }
}
