import { BaseVO, DataTable, HttpResult, PageQuery } from './base-data';
import { Observable } from 'rxjs';

export interface ApplicationActuatorVO extends BaseVO {
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
  livenessProbe: string;
  readinessProbe: string;
  startupProbe: string;
  lifecycle: string;
  comment: string;
  container: {
    livenessProbe: ApplicationActuatorProbeVO
    readinessProbe: ApplicationActuatorProbeVO
    startupProbe: ApplicationActuatorProbeVO
    lifecycle: {
      preStopExecCommand: string
      standard: boolean
    },
    standard: boolean
  };
}

export interface ApplicationActuatorProbeVO {
  path: string;
  port: number;
  standard: boolean;
}

export interface ApplicationActuatorPageQuery extends PageQuery {
  applicationName: string;
  namespace: string;
  framework: string;
  standard: boolean;
}

export abstract class ApplicationActuatorData {

  abstract queryApplicationActuatorPage(param: ApplicationActuatorPageQuery): Observable<DataTable<ApplicationActuatorVO>>;

  abstract scanApplicationActuator(): Observable<HttpResult<Boolean>>;

}
