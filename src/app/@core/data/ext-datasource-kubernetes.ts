import { Observable } from 'rxjs';
import { HttpResult, MessageResponse } from './base-data';
import { KubernetesNodeDetailsVO } from './kubernetes';

export interface QueryKubernetesNodeDetails {
  instanceName: string;
}

export interface EdsKubernetesNodeDetailsRequest {
  topic: string;
  action: string;
  instanceName: string;
}

export abstract class EdsKubernetesData {

  abstract queryKubernetesNodeDetails(param: QueryKubernetesNodeDetails): Observable<HttpResult<MessageResponse<KubernetesNodeDetailsVO>>>;

}
