import { BaseVO, HttpResult } from './base-data';
import { Observable } from 'rxjs';

export interface FinOpsAppCostVO extends BaseVO {
  costTable: string;
  costDetailsTable: string;
}

export interface QueryAppCost {
  allocationCategories: AllocationCategory[];
}

export interface AllocationCategory {
  name: string;
  currencyCode: string;
  amount: number;
}

export abstract class FinOpsData {

  abstract queryAppCost(query: QueryAppCost): Observable<HttpResult<FinOpsAppCostVO>>;

}
