import { Observable } from 'rxjs';
import { HttpResult, MessageResponse } from './base-data';
import { KubernetesDetailsVO } from './kubernetes';

export interface QueryApplicationResourceKubernetesDetails {
  applicationName: string;
  namespace: string;
  name: string;
}

export abstract class ApplicationResourceData {

  abstract queryApplicationResourceKubernetesDetails(param: QueryApplicationResourceKubernetesDetails): Observable<HttpResult<MessageResponse<KubernetesDetailsVO>>>;

}
