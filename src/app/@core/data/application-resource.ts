import { Observable } from 'rxjs';
import { HttpResult, MessageResponse, OptionsVO } from './base-data';
import { KubernetesDetailsVO } from './kubernetes';

export interface QueryApplicationResourceKubernetesDetails {
  applicationName: string;
  instanceName: string;
  namespace: string;
  name: string;
}

export interface QueryKubernetesDeploymentOptions {
  applicationName: string;
  namespace: string;
}

export interface KubernetesDeploymentImageVersion {
  exist: boolean;
  image: string;
  versionName: string;
  versionDesc: string;
}

export interface DeleteKubernetesDeploymentPod {
  applicationName: string;
  instanceName: string;
  namespace: string;
  deploymentName: string;
  podName: string;
}

export interface RedeployKubernetesDeployment {
  applicationName: string
  instanceName: string;
  namespace: string
  deploymentName: string
}

export abstract class ApplicationResourceData {

  abstract queryApplicationResourceKubernetesDetails(param: QueryApplicationResourceKubernetesDetails): Observable<HttpResult<MessageResponse<KubernetesDetailsVO>>>;

  abstract queryApplicationResourceKubernetesDeploymentOptions(param: QueryKubernetesDeploymentOptions): Observable<HttpResult<OptionsVO>>;

  abstract queryApplicationResourceKubernetesDeploymentImageVersion(param: {
    image: string
  }): Observable<HttpResult<KubernetesDeploymentImageVersion>>;

  abstract deleteApplicationResourceKubernetesDeploymentPod(param: DeleteKubernetesDeploymentPod): Observable<HttpResult<Boolean>>;

  abstract redeployApplicationResourceKubernetesDeployment(param: RedeployKubernetesDeployment): Observable<HttpResult<Boolean>>;
}
