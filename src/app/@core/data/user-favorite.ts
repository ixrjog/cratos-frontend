import { Observable } from 'rxjs';
import { HttpResult } from './base-data';
import { ApplicationVO } from './application';

export interface AddUserFavorite {
  businessType: string;
  name?: string
  businessId?: number;
}

export interface RemoveUserFavorite {
  businessType: string;
  name?: string
  businessId?: number;
}

export interface FavoriteGroupVO {
  name: string;
  businessId: number;
}


export abstract class UserFavoriteData {

  abstract getMyFavoriteApplication(): Observable<HttpResult<Array<ApplicationVO>>>;

  abstract addApplicationFavorite(param: AddUserFavorite): Observable<HttpResult<Boolean>>;

  abstract removeApplicationFavorite(param: RemoveUserFavorite): Observable<HttpResult<Boolean>>;

  abstract getMyFavoriteGroup(): Observable<HttpResult<Array<FavoriteGroupVO>>>;

  abstract addGroupFavorite(param: AddUserFavorite): Observable<HttpResult<Boolean>>;

  abstract removeGroupFavorite(param: RemoveUserFavorite): Observable<HttpResult<Boolean>>;

}
