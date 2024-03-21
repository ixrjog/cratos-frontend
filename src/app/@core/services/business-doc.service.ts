import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';
import { GetByBusiness } from '../data/business';
import { Injectable } from '@angular/core';
import { BusinessDocData, BusinessDocEdit, BusinessDocsVO, BusinessDocVO } from '../data/business-doc';

@Injectable()
export class BusinessDocService extends BusinessDocData {

  baseUrl = '/business/doc';
  constructor(private apiService: ApiService) {
    super();
  }

  addBusinessDoc(param: BusinessDocEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateBusinessDoc(param: BusinessDocEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/update', param);
  }

  deleteBusinessDocById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  queryBusinessDocByBusiness(param: GetByBusiness): Observable<HttpResult<Array<BusinessDocVO>>> {
    return this.apiService.post(this.baseUrl, '/query', param);
  }

}

export function getBusinessDocLength<T extends BusinessDocsVO>(businessObject: T): number {
  return businessObject.businessDocs.length;
}
