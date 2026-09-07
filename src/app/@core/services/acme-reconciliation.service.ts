import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DataTable } from '../data/base-data';
import { AcmeReconciliationData, AcmeReconciliationPageQuery, AcmeReconciliationVO } from '../data/acme-reconciliation';

@Injectable({
  providedIn: 'root',
})
export class AcmeReconciliationService extends AcmeReconciliationData {

  baseUrl = '/acme';

  constructor(private apiService: ApiService) {
    super();
  }

  queryAcmeReconciliationPage(param: AcmeReconciliationPageQuery): Observable<DataTable<AcmeReconciliationVO>> {
    return this.apiService.post(this.baseUrl, '/reconciliation/page/query', param);
  }

}
