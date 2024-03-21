import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { TagData, TagEdit, TagPageQuery, TagVO } from '../data/tag';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class TagService extends TagData {

  baseUrl = '/tag';

  constructor(private apiService: ApiService) {
    super();
  }

  queryTagPage(param: TagPageQuery): Observable<DataTable<TagVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  updateTag(param: TagEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  addTag(param: TagEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  deleteTagById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }

  setTagValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam(this.baseUrl, '/valid/set', param);
  }

}
