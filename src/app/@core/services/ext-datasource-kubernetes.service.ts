import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResult, MessageResponse } from '../data/base-data';
import { KubernetesNodeDetailsVO } from '../data/kubernetes';
import { EdsKubernetesData, QueryKubernetesNodeDetails } from '../data/ext-datasource-kubernetes';

@Injectable()
export class EdsKubernetesService extends EdsKubernetesData {

  baseUrl = '/eds/instance/kubernetes';

  constructor(private apiService: ApiService) {
    super();
  }

  queryKubernetesNodeDetails(param: QueryKubernetesNodeDetails): Observable<HttpResult<MessageResponse<KubernetesNodeDetailsVO>>> {
    return this.apiService.post(this.baseUrl, '/node/details/query', param);
  }

}
