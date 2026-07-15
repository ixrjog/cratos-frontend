import { Observable } from 'rxjs';
import { HttpResult, MessageResponse, OptionsVO } from './base-data';
import { KubernetesDetailsVO } from './kubernetes';

export interface QueryApplicationResourceKubernetesDetails {
  applicationName: string;
  instanceName: string;
  namespace: string;
  name: string;
  countryCode: string;
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

export interface OpsJvmClassHistogram {
  applicationName: string;
  instanceId?: number;
  instanceName: string;
  namespace: string;
  deploymentName: string;
  podName: string;
  containerName: string;
}

export interface JvmClassHistogramVO {
  jcmd: string;
  result: string;
}

export interface OpsJstack {
  applicationName: string;
  instanceId?: number;
  instanceName: string;
  namespace: string;
  deploymentName: string;
  podName: string;
  containerName: string;
}

export interface JstackTaskVO {
  taskNo: string;
}

export interface OpsHeapDump {
  applicationName: string;
  instanceId?: number;
  instanceName: string;
  namespace: string;
  deploymentName: string;
  podName: string;
  containerName: string;
}

export interface HeapDumpTaskVO {
  taskNo: string;
}

export interface OpsTaskVO {
  taskNo: string;
  opsType: string;
  applicationName: string;
  instanceName: string;
  namespace: string;
  podName: string;
  containerName: string;
  fileName: string;
  fileSize?: number;
  valid: boolean;
  createTime: string;
  expiredTime: string;
}

export interface GetOpsTaskFileParam {
  taskNo: string;
}

export interface GetOpsTaskFileVO {
  taskNo: string;
  fileName: string;
  downloadUrl: string;
  jifaAnalysisRequest?: string;
}

export abstract class ApplicationResourceData {

  abstract queryApplicationResourceKubernetesDetails(param: QueryApplicationResourceKubernetesDetails): Observable<HttpResult<MessageResponse<KubernetesDetailsVO>>>;

  abstract queryApplicationResourceKubernetesDeploymentOptions(param: QueryKubernetesDeploymentOptions): Observable<HttpResult<OptionsVO>>;

  abstract queryApplicationResourceKubernetesDeploymentImageVersion(param: {
    image: string
  }): Observable<HttpResult<KubernetesDeploymentImageVersion>>;

  abstract deleteApplicationResourceKubernetesDeploymentPod(param: DeleteKubernetesDeploymentPod): Observable<HttpResult<Boolean>>;

  abstract redeployApplicationResourceKubernetesDeployment(param: RedeployKubernetesDeployment): Observable<HttpResult<Boolean>>;

  abstract opsJvmClassHistogram(param: OpsJvmClassHistogram): Observable<HttpResult<JvmClassHistogramVO>>;

  abstract opsJstackTask(param: OpsJstack): Observable<HttpResult<JstackTaskVO>>;

  abstract opsHeapDumpTask(param: OpsHeapDump): Observable<HttpResult<HeapDumpTaskVO>>;

  abstract queryMyOpsTaskFiles(): Observable<HttpResult<OpsTaskVO[]>>;

  abstract getOpsTaskFile(param: GetOpsTaskFileParam): Observable<HttpResult<GetOpsTaskFileVO>>;
}
