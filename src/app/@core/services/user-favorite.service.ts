import { Injectable } from '@angular/core';
import { AddUserFavorite, FavoriteGroupVO, RemoveUserFavorite, UserFavoriteData } from '../data/user-favorite';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';
import { ApplicationVO } from '../data/application';

@Injectable()
export class UserFavoriteService extends UserFavoriteData {

  baseUrl = '/user/favorite';

  constructor(private apiService: ApiService) {
    super();
  }

  addApplicationFavorite(param: AddUserFavorite): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/application/add', param);
  }

  getMyFavoriteApplication(): Observable<HttpResult<Array<ApplicationVO>>> {
    return this.apiService.get(this.baseUrl, '/my/application/get', {});
  }

  removeApplicationFavorite(param: RemoveUserFavorite): Observable<HttpResult<Boolean>> {
    return this.apiService.deleteByBody(this.baseUrl, '/application/remove', param);
  }

  getMyFavoriteGroup(): Observable<HttpResult<Array<FavoriteGroupVO>>> {
    return this.apiService.get(this.baseUrl, '/my/group/get', {});
  }

  addGroupFavorite(param: AddUserFavorite): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/group/add', param);
  }

  removeGroupFavorite(param: RemoveUserFavorite): Observable<HttpResult<Boolean>> {
    return this.apiService.deleteByBody(this.baseUrl, '/group/remove', param);
  }
}
