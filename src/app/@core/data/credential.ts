import { DataTable, PageQuery, ValidVO } from './base-data';
import { Observable } from 'rxjs';

interface BusinessTagVo {
}

export interface CredentialVo extends ValidVO {
  id: number;
  title: string;
  credentialType: string;
  username: string;
  fingerprint: string;
  credential: string;
  credential2: string;
  passphrase: string;
  comment: string;
  businessTags: BusinessTagVo[];
}

export interface CredentialPageQuery extends PageQuery {
  queryName: string;
  credentialType?: string;
}

export abstract class CredentialData {
  abstract queryCredentialPage(param: CredentialPageQuery): Observable<DataTable<CredentialVo>>;
}

