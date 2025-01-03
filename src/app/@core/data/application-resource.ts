import { Observable } from 'rxjs';
import { HttpResult, MessageResponse, OptionsVO } from './base-data';
import { KubernetesDetailsVO } from './kubernetes';

export interface QueryApplicationResourceKubernetesDetails {
  applicationName: string;
  namespace: string;
  name: string;
}

export interface QueryKubernetesDeploymentOptions {
  applicationName: string;
  namespace: string;
}

export abstract class ApplicationResourceData {

  abstract queryApplicationResourceKubernetesDetails(param: QueryApplicationResourceKubernetesDetails): Observable<HttpResult<MessageResponse<KubernetesDetailsVO>>>;

  abstract queryApplicationResourceKubernetesDeploymentOptions(param: QueryKubernetesDeploymentOptions): Observable<HttpResult<OptionsVO>>;
}
