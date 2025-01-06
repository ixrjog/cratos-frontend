import { BaseVO, DataTable, HttpResult, OptionsVO, PageQuery } from './base-data';
import { Observable } from 'rxjs';
import { EnvVO } from './env';

export interface ApplicationResourceBaselineVO extends BaseVO {
  id: number;
  applicationName: string;
  instanceName: string;
  name: string;
  displayName: string;
  resourceType: string;
  businessId: number;
  businessType: string;
  namespace: string;
  framework: string;
  standard: boolean;
  comment: string;
  env: EnvVO;
  container: {
    livenessProbe: ApplicationResourceBaselineProbeVO
    readinessProbe: ApplicationResourceBaselineProbeVO
    startupProbe: ApplicationResourceBaselineProbeVO
    lifecycle: ApplicationResourceBaselineLifecycleVO
    env: ApplicationResourceBaselineEnvVarVO[]
  }
}

export interface ApplicationResourceBaselineProbeVO {
  path: string;
  port: number;
  standard: boolean;
  content: string;
  baseline: ApplicationResourceBaselineProbeVO;
}

export interface ApplicationResourceBaselineLifecycleVO {
  preStopExecCommand: string;
  standard: boolean;
  content: string;
  baseline: ApplicationResourceBaselineLifecycleVO;
}

export interface ApplicationResourceBaselineEnvVarVO {
  name: string;
  value: string;
  valueFrom: {
    configMapKeyRef: {
      key: string
      name: string
      optional: boolean
    }
  };
  standard: boolean;
  content: string;
  baseline: ApplicationResourceBaselineEnvVarVO;
}

export interface ApplicationResourceBaselinePageQuery extends PageQuery {
  applicationName: string;
  namespace: string;
  framework: string;
  standard: boolean;
  byMemberType: {
    baselineType: string;
    standard: boolean;
  };
}

export abstract class ApplicationResourceBaselineData {

  abstract queryApplicationResourceBaselinePage(param: ApplicationResourceBaselinePageQuery): Observable<DataTable<ApplicationResourceBaselineVO>>;

  abstract scanAllBaseline(): Observable<HttpResult<Boolean>>;

  abstract getBaselineTypeOptions(): Observable<HttpResult<OptionsVO>>;

  abstract rescanBaselineById(param: { baselineId: number }): Observable<HttpResult<Boolean>>;

  abstract mergeToBaseline(param: { baselineId: number }): Observable<HttpResult<Boolean>>;

}
