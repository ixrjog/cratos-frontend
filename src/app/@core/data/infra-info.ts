import { Observable } from 'rxjs';
import { DataTable, HttpResult } from './base-data';

export interface InfraInfoVO {
  id: number;
  name: string;
  project: string;
  envName: string;
  country: string;
  createTime: string;
  updateTime: string;
  doc: string;
  comment: string;
}

export interface InfraInfoPageQuery {
  queryName?: string;
  project?: string;
  country?: string;
  page: number;
  length: number;
}

export interface InfraInfoEdit {
  id: number;
  name: string;
  project: string;
  envName: string;
  country: string;
  doc: string;
  comment: string;
}

export abstract class InfraInfoData {
  abstract queryInfraInfoPage(param: InfraInfoPageQuery): Observable<DataTable<InfraInfoVO>>;
  abstract updateInfraInfo(param: InfraInfoEdit): Observable<HttpResult<boolean>>;
}
