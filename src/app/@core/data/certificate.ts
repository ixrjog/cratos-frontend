import { Observable } from 'rxjs';
import { BaseVO, DataTable, PageQuery } from './base-data';

export interface CertificateVo extends BaseVO{
  id: number;
  certificateId: string;
  name: string;
  domainName: string;
  certificateType: string;
  valid: boolean;
  keyAlgorithm: string;
  notBefore: string;
  notAfter: string;
  comment: string;
}
export interface CertificatePageQuery extends PageQuery {
  queryName?: string;
}

export abstract class CertificateData {
  abstract queryCertificatePage(param: CertificatePageQuery): Observable<DataTable<CertificateVo>>;
}
