import { Observable } from 'rxjs';
import { HttpResult } from './base-data';

export interface ScheduleVO {
  name: string;
  group: string;
  status: string;
  description: string;
  cronExpression: string;
  executionTime: string[];
}

export interface AddScheduleJob {
  jobType: string;
  instanceId: number;
  assetType: string;
  jobTime: string;
  jobDescription: string;
}

export interface UpdateScheduleJob {
  name: string;
  group: string;
}

export interface DeleteScheduleJob {
  name: string;
  group: string;
}

export interface CheckCron {
  jobTime: string;
}

export abstract class EdsScheduleData {

  abstract queryScheduleById(param: { id: number }): Observable<HttpResult<Array<ScheduleVO>>>;

  abstract addSchedule(param: AddScheduleJob): Observable<HttpResult<Boolean>>;

  abstract pauseSchedule(param: UpdateScheduleJob): Observable<HttpResult<Boolean>>;

  abstract resumeSchedule(param: UpdateScheduleJob): Observable<HttpResult<Boolean>>;

  abstract deleteSchedule(param: DeleteScheduleJob): Observable<HttpResult<Boolean>>;

  abstract checkCron(param: CheckCron): Observable<HttpResult<Array<string>>>;

}
