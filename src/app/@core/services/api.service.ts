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
    };
    
    const robotToken = localStorage.getItem('robotToken');
    if (robotToken && robotToken.length > 10) {
      headersConfig['Authorization'] = `Robot ${robotToken}`;
    } else {
      if (robotToken) localStorage.removeItem('robotToken');
      
      let token = localStorage.getItem('id_token');
      if (token) {
        headersConfig['Authorization'] = 'Bearer ' + token;
      }
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
