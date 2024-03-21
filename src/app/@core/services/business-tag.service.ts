import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BusinessTagData, BusinessTagEdit, BusinessTagsVO, BusinessTagVO, ListValue } from '../data/business-tag';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';
import { GetByBusiness } from '../data/business';

@Injectable()
export class BusinessTagService extends BusinessTagData {

  baseUrl = '/business/tag';

  constructor(private apiService: ApiService) {
    super();
  }

  addBusinessTag(param: BusinessTagEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  saveBusinessTag(param: BusinessTagEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/save', param);
  }

  deleteBusinessTagById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  queryBusinessTagByBusiness(param: GetByBusiness): Observable<HttpResult<Array<BusinessTagVO>>> {
    return this.apiService.post(this.baseUrl, '/query', param);
  }

  updateBusinessTag(param: BusinessTagEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  queryBusinessTagByValue(param: ListValue): Observable<HttpResult<Array<String>>> {
    return this.apiService.post(this.baseUrl, '/query/by/value', param);
  }

}

export function getBusinessTagLength<T extends BusinessTagsVO>(businessObject: T): number {
  return businessObject.businessTags.length;
}

