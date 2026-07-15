import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResult, MessageResponse, OptionsVO } from '../data/base-data';
import { KubernetesDetailsVO } from '../data/kubernetes';
import {
  ApplicationResourceData, DeleteKubernetesDeploymentPod,
  KubernetesDeploymentImageVersion,
  QueryApplicationResourceKubernetesDetails,
  QueryKubernetesDeploymentOptions, RedeployKubernetesDeployment,
  OpsJvmClassHistogram, JvmClassHistogramVO,
  OpsJstack, JstackTaskVO,
  OpsHeapDump, HeapDumpTaskVO,
  OpsTaskVO, GetOpsTaskFileParam, GetOpsTaskFileVO,
} from '../data/application-resource';

@Injectable()
export class ApplicationResourceService extends ApplicationResourceData {

  baseUrl = '/application/resource';

  constructor(private apiService: ApiService) {
    super();
  }

  queryApplicationResourceKubernetesDetails(param: QueryApplicationResourceKubernetesDetails): Observable<HttpResult<MessageResponse<KubernetesDetailsVO>>> {
    return this.apiService.post(this.baseUrl, '/kubernetes/details/query', param);
  }

  queryApplicationResourceKubernetesDeploymentOptions(param: QueryKubernetesDeploymentOptions): Observable<HttpResult<OptionsVO>> {
    return this.apiService.post(this.baseUrl, '/kubernetes/deployment/options', param);
  }

  queryApplicationResourceKubernetesDeploymentImageVersion(param: {
    image: string
  }): Observable<HttpResult<KubernetesDeploymentImageVersion>> {
    return this.apiService.post(this.baseUrl, '/kubernetes/deployment/pod/container/image/version/query', param);
  }

  deleteApplicationResourceKubernetesDeploymentPod(param: DeleteKubernetesDeploymentPod): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/kubernetes/deployment/pod/del', param);
  }

  redeployApplicationResourceKubernetesDeployment(param: RedeployKubernetesDeployment): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/kubernetes/deployment/redeploy', param);
  }

  opsJvmClassHistogram(param: OpsJvmClassHistogram): Observable<HttpResult<JvmClassHistogramVO>> {
    return this.apiService.post(this.baseUrl, '/kubernetes/deployment/pod/container/ops/jvm/class-histogram', param);
  }

  opsJstackTask(param: OpsJstack): Observable<HttpResult<JstackTaskVO>> {
    return this.apiService.post(this.baseUrl, '/kubernetes/deployment/pod/container/ops/jstack/task', param);
  }

  opsHeapDumpTask(param: OpsHeapDump): Observable<HttpResult<HeapDumpTaskVO>> {
    return this.apiService.post(this.baseUrl, '/kubernetes/deployment/pod/container/ops/heap/dump/task', param);
  }

  queryMyOpsTaskFiles(): Observable<HttpResult<OpsTaskVO[]>> {
    return this.apiService.get(this.baseUrl, '/kubernetes/deployment/pod/container/ops/task/file/my/query', {});
  }

  getOpsTaskFile(param: GetOpsTaskFileParam): Observable<HttpResult<GetOpsTaskFileVO>> {
    return this.apiService.post(this.baseUrl, '/kubernetes/deployment/pod/container/ops/task/file/get', param);
  }
}
