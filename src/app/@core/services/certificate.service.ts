import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CertificateData, CertificatePageQuery, CertificateVo } from '../data/certificate';
import { DataTable } from '../data/base-data';

@Injectable()
export class CertificateService extends CertificateData {

  constructor(private apiService: ApiService) {
    super();
  }

  queryCertificatePage(param: CertificatePageQuery): Observable<DataTable<CertificateVo>> {
    return this.apiService.post('/certificate/page/query', param);
  }
}
