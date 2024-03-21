import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  AddScheduleJob,
  CheckCron,
  DeleteScheduleJob,
  EdsScheduleData,
  ScheduleVO,
  UpdateScheduleJob,
} from '../data/ext-datasource-schedule';
import { Observable } from 'rxjs';
import { HttpResult } from '../data/base-data';

@Injectable()
export class EdsScheduleService extends EdsScheduleData {

  baseUrl = '/eds/instance/schedule';
  constructor(private apiService: ApiService) {
    super();
  }

  addSchedule(param: AddScheduleJob): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

  checkCron(param: CheckCron): Observable<HttpResult<Array<string>>> {
    return this.apiService.post(this.baseUrl, '/cron/check', param);
  }

  deleteSchedule(param: DeleteScheduleJob): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/delete', param);
  }

  pauseSchedule(param: UpdateScheduleJob): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/pause', param);
  }

  queryScheduleById(param: { id: number }): Observable<HttpResult<Array<ScheduleVO>>> {
    return this.apiService.get(this.baseUrl, '/get', param);
  }

  resumeSchedule(param: UpdateScheduleJob): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/resume', param);
  }

}
