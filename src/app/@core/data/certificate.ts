import { Observable } from 'rxjs';
import {  DataTable, HttpResult, PageQuery, ValidVO } from './base-data';
import { BusinessTagVO } from './business-tag';

export interface CertificateVo extends ValidVO {
  id: number;
  certificateId: string;
  name: string;
  domainName: string;
  certificateType: string;
  keyAlgorithm: string;
  notBefore: Date;
  notAfter: Date;
  comment: string;
  businessTags: BusinessTagVO[];
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

  abstract queryCertificatePage(param: CertificatePageQuery): Observable<DataTable<CertificateVo>>;

  abstract addCertificate(param: CertificateEdit): Observable<HttpResult<Boolean>>;

  abstract updateCertificate(param: CertificateEdit): Observable<HttpResult<Boolean>>;

  abstract setCertificateValidById(param: { id: number }): Observable<HttpResult<Boolean>>;

  abstract deleteCertificateById(param: { id: number }): Observable<HttpResult<Boolean>>;

}
