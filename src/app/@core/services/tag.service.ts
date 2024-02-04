import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { TagData, TagEdit, TagPageQuery, TagVO } from '../data/tag';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class TagService extends TagData {

  constructor(private apiService: ApiService) {
    super();
  }

  queryTagPage(param: TagPageQuery): Observable<DataTable<TagVO>> {
    return this.apiService.post('/tag/page/query', param);
  }

  updateTag(param: TagEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put('/tag/update', param);
  }

  addTag(param: TagEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post('/tag/add', param);
  }

  deleteTagById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete('/tag/del', param);
  }

  setTagValidById(param: { id: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.putByParam('/tag/valid/set', param);
  }

}
