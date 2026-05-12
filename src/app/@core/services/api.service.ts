import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';
import { EncryptionConfig } from '../config/encryption.config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) {
  }

  get(baseUrl: string, url: string, params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}${baseUrl}${url}` + this.initGetParams(params), { headers: this.headers });
  }

  post(baseUrl: string, url: string, data: object = {}): Observable<any> {
    // 如果启用加密，则加密 body
    if (EncryptionConfig.enabled) {
      return from(this.encryptionService.encryptBody(data)).pipe(
        switchMap(({ encryptedBody, encryptedKey }) => {
          const encryptedData = {
            encryptedBody,
            encryptedKey
          };
          return this.http.post(
            `${this.apiUrl}${baseUrl}${url}`,
            JSON.stringify(encryptedData),
            { headers: this.getEncryptedHeaders(`${baseUrl}${url}`) }
          );
        }),
        switchMap((response: any) => {
          // 如果启用了响应加密且响应包含加密数据
          // console.log('Response received:', response);
          if (EncryptionConfig.responseEncryptionEnabled && response?.encryptedData) {
            console.log('Decrypting response...');
            return from(this.encryptionService.decryptResponse(response.encryptedData));
          }
          // console.log('Response not encrypted, returning as-is');
          return of(response);
        }),
        catchError(error => {
          console.error('Encryption/Decryption error:', error);
          this.encryptionService.clearAESKey();
          throw error;
        })
      );
    }

    // 未启用加密，正常发送
    return this.http.post(`${this.apiUrl}${baseUrl}${url}`, JSON.stringify(data), { headers: this.headers });
  }

  put(baseUrl: string, url: string, data: object = {}): Observable<any> {
    // 如果启用加密，则加密 body
    if (EncryptionConfig.enabled) {
      return from(this.encryptionService.encryptBody(data)).pipe(
        switchMap(({ encryptedBody, encryptedKey }) => {
          const encryptedData = {
            encryptedBody,
            encryptedKey
          };
          return this.http.put(
            `${this.apiUrl}${baseUrl}${url}`,
            JSON.stringify(encryptedData),
            { headers: this.getEncryptedHeaders(`${baseUrl}${url}`) }
          );
        }),
        switchMap((response: any) => {
          if (EncryptionConfig.responseEncryptionEnabled && response?.encryptedData) {
            return from(this.encryptionService.decryptResponse(response.encryptedData));
          }
          return of(response);
        }),
        catchError((error: any) => {
          console.error('Encryption/Decryption error:', error);
          this.encryptionService.clearAESKey();
          throw error;
        })
      );
    }

    // 未启用加密，正常发送
    return this.http.put(`${this.apiUrl}${baseUrl}${url}`, JSON.stringify(data), { headers: this.headers });
  }

  putByParam(baseUrl: string,url: string, params: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${baseUrl}${url}` + this.initGetParams(params), {}, { headers: this.headers });
  }

  delete(baseUrl: string,url: string, params: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}${baseUrl}${url}` + this.initGetParams(params), { headers: this.headers });
  }

  deleteByBody(baseUrl: string, url: string, data: object = {}): Observable<any> {
    // 如果启用加密，则加密 body
    if (EncryptionConfig.enabled) {
      return from(this.encryptionService.encryptBody(data)).pipe(
        switchMap(({ encryptedBody, encryptedKey }) => {
          const encryptedData = {
            encryptedBody,
            encryptedKey
          };
          return this.http.delete(
            `${this.apiUrl}${baseUrl}${url}`,
            { body: JSON.stringify(encryptedData), headers: this.getEncryptedHeaders(`${baseUrl}${url}`) }
          );
        }),
        switchMap((response: any) => {
          if (EncryptionConfig.responseEncryptionEnabled && response?.encryptedData) {
            return from(this.encryptionService.decryptResponse(response.encryptedData));
          }
          return of(response);
        }),
        catchError((error: any) => {
          console.error('Encryption/Decryption error:', error);
          this.encryptionService.clearAESKey();
          throw error;
        })
      );
    }

    // 未启用加密，正常发送
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

  /**
   * 获取加密请求的 Headers（包含加密标识和密钥版本）
   */
  private getEncryptedHeaders(url?: string): HttpHeaders {
    const headersConfig: any = {
      'Content-Type': 'application/json',
      [EncryptionConfig.encryptionHeader]: 'true',
      [EncryptionConfig.keyVersionHeader]: EncryptionConfig.keyVersion,
    };

    // 如果启用响应加密，根据路径配置决定是否添加 Header
    if (EncryptionConfig.responseEncryptionEnabled) {
      const paths = EncryptionConfig.responseEncryptionPaths;
      if (paths.length === 0 || (url && paths.some(p => url.includes(p)))) {
        headersConfig[EncryptionConfig.responseEncryptionHeader] = 'true';
      }
    }

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
