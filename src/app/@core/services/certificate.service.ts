import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CertificateData, CertificateEdit, CertificatePageQuery, CertificateVO } from '../data/certificate';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class CertificateService extends CertificateData {

  baseUrl = '/certificate';

  constructor(private apiService: ApiService) {
    super();
  }

  queryCertificatePage(param: CertificatePageQuery): Observable<DataTable<CertificateVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  addCertificate(param: CertificateEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  deleteCertificateById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  setCertificateValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

  updateCertificate(param: CertificateEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

}
