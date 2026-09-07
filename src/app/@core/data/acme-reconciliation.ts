import { Observable } from 'rxjs';
import { BaseVO, DataTable, PageQuery } from './base-data';

export interface AcmeReconciliationVO extends BaseVO {
  id: number;
  instanceName: string;
  kind: string;
  name: string;
  reconciliation: string;
  comment: string;
  cnt: number;
}

export interface AcmeReconciliationPageQuery extends PageQuery {
  queryName: string;
  instanceName: string;
}

export abstract class AcmeReconciliationData {

  abstract queryAcmeReconciliationPage(param: AcmeReconciliationPageQuery): Observable<DataTable<AcmeReconciliationVO>>;

}
