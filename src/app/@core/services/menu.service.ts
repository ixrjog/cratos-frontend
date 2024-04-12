import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { MenuData, MenuEdit, MenuPageQuery, MenuVO, NavMenuVO, QueryMenu } from '../data/menu';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';

@Injectable()
export class MenuService extends MenuData {

  baseUrl = '/menu';

  constructor(private apiService: ApiService) {
    super();
  }

  queryMenuPage(param: MenuPageQuery): Observable<DataTable<MenuVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  queryMyMenu(param: QueryMenu): Observable<HttpResult<Array<MenuVO>>> {
    return this.apiService.post(this.baseUrl, '/my/query', param);
  }

  getNavMenu(): Observable<HttpResult<NavMenuVO>> {
    return this.apiService.get(this.baseUrl, '/nav/get', {});
  }


  getMenuById(param: { id: number }): Observable<HttpResult<MenuVO>> {
    return this.apiService.get(this.baseUrl, '/get', param);
  }

  addMenu(param: MenuEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  updateMenu(param: MenuEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  deleteMenuById(param: { menuId: number }): Observable<HttpResult<Boolean>> {
    return this.apiService.delete(this.baseUrl, '/del', param);
  }
}
