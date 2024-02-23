import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';
import { GetByBusiness } from '../data/business';
import { Injectable } from '@angular/core';
import { BusinessDocData, BusinessDocEdit, BusinessDocsVO, BusinessDocVO } from '../data/business-doc';

@Injectable()
export class BusinessDocService extends BusinessDocData {

  constructor(private apiService: ApiService) {
    super();
  }

  addBusinessDoc(param: BusinessDocEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/business/doc/add', param);
  }

  updateBusinessDoc(param: BusinessDocEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/business/doc/update', param);
  }

  deleteBusinessDocById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/business/doc/del', param);
  }

  queryBusinessDocByBusiness(param: GetByBusiness): Observable<HttpResult<Array<BusinessDocVO>>> {
    return this.apiService.post('/business/doc/query', param);
  }

}

export function getBusinessDocLength<T extends BusinessDocsVO>(businessObject: T): number {
  return businessObject.businessDocs.length;
}
