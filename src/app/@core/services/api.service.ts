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

  get(baseUrl: string, url: string, params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}${baseUrl}${url}` + this.initGetParams(params), { headers: this.headers });
  }

  post(baseUrl: string,url: string, data: object = {}): Observable<any> {
    return this.http.post(`${this.apiUrl}${baseUrl}${url}`, JSON.stringify(data), { headers: this.headers });
  }

  put(baseUrl: string,url: string, data: object = {}): Observable<any> {
    return this.http.put(`${this.apiUrl}${baseUrl}${url}`, JSON.stringify(data), { headers: this.headers });
  }

  putByParam(baseUrl: string,url: string, params: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${baseUrl}${url}` + this.initGetParams(params), {}, { headers: this.headers });
  }

  delete(baseUrl: string,url: string, params: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}${baseUrl}${url}` + this.initGetParams(params), { headers: this.headers });
  }

  deleteByBody(baseUrl: string,url: string, data: object = {}): Observable<any> {
    return this.http.delete(`${this.apiUrl}${baseUrl}${url}`, { body: JSON.stringify(data), headers: this.headers });
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
