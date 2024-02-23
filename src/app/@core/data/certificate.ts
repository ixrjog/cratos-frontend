import { Observable } from 'rxjs';
import { BaseVO, DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { BusinessTagsVO } from './business-tag';
import { BusinessDocsVO } from './business-doc';

export interface CertificateVO extends BaseVO, ValidVO, BusinessDocsVO, BusinessTagsVO {
  id: number;
  certificateId: string;
  name: string;
  domainName: string;
  certificateType: string;
  keyAlgorithm: string;
  notBefore: Date;
  notAfter: Date;
  comment: string;
}

export interface CertificatePageQuery extends PageQuery {
  queryName?: string;
}

export interface CertificateEdit {
  id?: number;
  certificateId: string;
  name: string;
  domainName: string;
  certificateType: string;
  keyAlgorithm: string;
  notBefore: Date;
  notAfter: Date;
  valid: boolean;
  comment?: string;
}

export abstract class CertificateData {

  abstract queryCertificatePage(param: CertificatePageQuery): Observable<DataTable<CertificateVO>>;

  abstract addCertificate(param: CertificateEdit): Observable<HttpResult<Boolean>>;

  abstract updateCertificate(param: CertificateEdit): Observable<HttpResult<Boolean>>;

  abstract setCertificateValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteCertificateById(param: { id: number }): Observable<HttpResult<Boolean>>;

}
