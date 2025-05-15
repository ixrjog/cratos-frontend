import { Observable } from 'rxjs';
import { BaseVO, DataTable, PageQuery } from './base-data';
import { EdsAssetIndexVO, EdsAssetVO } from './ext-datasource';

export interface ApplicationCredentialVO extends BaseVO {
  asset: EdsAssetVO;
  indices: EdsAssetIndexVO[];
}

export interface ApplicationCredentialPageQuery extends PageQuery {
  queryName: string;
}

export abstract class ApplicationCredentialData {

  abstract queryCredentialPage(param: ApplicationCredentialPageQuery): Observable<DataTable<ApplicationCredentialVO>>;

}
