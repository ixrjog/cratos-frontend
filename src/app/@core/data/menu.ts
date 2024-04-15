import { BaseVO, HttpResult, ValidVO } from './base-data';
import { Observable } from 'rxjs';

export interface MenuVO extends BaseVO, ValidVO {
  id: number;
  name: string;
  title: string;
  icon: string;
  link: string;
  seq: number;
  parentId: number;
  menuType: string;
  menuTitles: MenuTitleVO[];
  children: MenuVO[];
  active: boolean;
  open: boolean;
}

export interface MenuTitleVO extends BaseVO {
  id: number;
  menuId: number;
  title: string;
  lang: string;
  preference: boolean;
}

export interface NavMenuVO {
  items: MenuVO[];
}

export interface RoleMenuVO {
  id: number,
  name: string
  open: boolean
  isChecked: boolean
  items: RoleMenuVO[]
}

export interface QueryMenu {
  lang: string;
}

export interface MenuEdit {
  id?: number;
  name: string;
  icon: string;
  link: string;
  seq: number;
  parentId: number;
  valid: boolean;
  menuType: string;
  titles?: {
    title: string
    lang: string
  }[];
}

export abstract class MenuData {

  abstract queryMyMenu(param: QueryMenu): Observable<HttpResult<Array<MenuVO>>>;

  abstract getNavMenu(): Observable<HttpResult<NavMenuVO>>;

  abstract getMenuById(param: { id: number }): Observable<HttpResult<MenuVO>>;

  abstract addMenu(param: MenuEdit): Observable<HttpResult<Boolean>>;

  abstract updateMenu(param: MenuEdit): Observable<HttpResult<Boolean>>;

  abstract deleteMenuById(param: { menuId: number }): Observable<HttpResult<Boolean>>;

  abstract getRoleMenuByRoleId(param: { roleId: number, lang: string }): Observable<HttpResult<{
    items: RoleMenuVO[]
  }>>;

}

export enum MenuTypeEnum {
  MAIN = 'MAIN',
  SUB = 'SUB'
}
