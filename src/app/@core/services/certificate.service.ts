import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CertificateData, CertificateEdit, CertificatePageQuery, CertificateVo } from '../data/certificate';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class CertificateService extends CertificateData {

  constructor(private apiService: ApiService) {
    super();
  }

  queryCertificatePage(param: CertificatePageQuery): Observable<DataTable<CertificateVo>> {
    return this.apiService.post('/certificate/page/query', param);
  }

  addCertificate(param: CertificateEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/certificate/add', param);
  }

  deleteCertificateById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/certificate/del', param);
  }

  setCertificateValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam('/certificate/valid/set', param);
  }

  updateCertificate(param: CertificateEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/certificate/update', param);
  }

}
