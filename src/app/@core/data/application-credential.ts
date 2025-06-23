import { Observable } from 'rxjs';
import { BaseVO, DataTable, PageQuery } from './base-data';
import { EdsAssetVO, EdsInstanceVO } from './ext-datasource';
import { BusinessTagsVO } from './business-tag';

export interface ApplicationCredentialVO extends BaseVO, BusinessTagsVO {
  edsInstance: EdsInstanceVO;
  kmsInstance: EdsAssetVO;
  kmsInstanceId: string;
  secretName: string;
  secretType: string;
  encryptionKeyId: string;
  arn: string;
  description: string;
  assetId: string;
}

export interface ApplicationCredentialPageQuery extends PageQuery {
  queryName: string;
  createdBy: string;
}

export abstract class ApplicationCredentialData {

  abstract queryCredentialPage(param: ApplicationCredentialPageQuery): Observable<DataTable<ApplicationCredentialVO>>;

}
