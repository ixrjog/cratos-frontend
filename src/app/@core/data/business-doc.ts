import { Observable } from 'rxjs';
import { BaseVO, HttpResult } from './base-data';
import { GetByBusiness } from './business';

export interface BusinessDocVO extends BaseVO {
  id: number;
  businessType: string;
  businessId: number;
  documentType: string;
  name: string;
  seq: number;
  comment: string;
  content: string;
  author: string;
  lastEditor: string;
}

export interface BusinessDocsVO {
  businessDocs: BusinessDocVO[]
}

export interface BusinessDocEdit {
  id?: number;
  businessType: string;
  businessId: number;
  documentType: string;
  name: string;
  seq: number;
  comment: string;
  content: string;
}

export abstract class BusinessDocData {

  abstract queryBusinessDocByBusiness(param: GetByBusiness): Observable<HttpResult<Array<BusinessDocVO>>>;

  abstract addBusinessDoc(param: BusinessDocEdit): Observable<HttpResult<Boolean>>;

  abstract updateBusinessDoc(param: BusinessDocEdit): Observable<HttpResult<Boolean>>;

  abstract deleteBusinessDocById(param: { id: number }): Observable<HttpResult<Boolean>>;

}

