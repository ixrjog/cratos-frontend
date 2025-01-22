import { Observable } from 'rxjs';
import { HttpResult } from './base-data';

export interface DnsResolveVO {
  Status: number;
  TC: string;
  RD: string;
  RA: string;
  AD: string;
  CD: string;
  Question: {
    name: string
    type: number
  }[];
  Answer: {
    name: string
    type: number
    TTL: number
    data: string
  }[];
}

export abstract class CommonData {

  abstract resolveDns(param: { name: string }): Observable<HttpResult<DnsResolveVO>>;

}
