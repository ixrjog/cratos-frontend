import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BusinessTagData, BusinessTagEdit, BusinessTagVo, GetByBusiness, ListValue } from '../data/business-tag';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';

@Injectable()
export class BusinessTagService extends BusinessTagData {

  constructor(private apiService: ApiService) {
    super();
  }

  addBusinessTag(param: BusinessTagEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/business/tag/add', param);
  }

  deleteBusinessTagById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/business/tag/del', param);
  }

  queryBusinessTagByBusiness(param: GetByBusiness): Observable<HttpResult<Array<BusinessTagVo>>> {
    return this.apiService.post('/business/tag/query', param);
  }

  updateBusinessTag(param: BusinessTagEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/business/tag/update', param);
  }

  queryBusinessTagByValue(param: ListValue): Observable<HttpResult<Array<BusinessTagVo>>> {
    return this.apiService.post('/business/tag/query/by/value', param);
  }

}
