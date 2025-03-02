import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResult, MessageResponse, OptionsVO } from '../data/base-data';
import { KubernetesDetailsVO } from '../data/kubernetes';
import {
  ApplicationResourceData,
  QueryApplicationResourceKubernetesDetails,
  QueryKubernetesDeploymentOptions,
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

}
