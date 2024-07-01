import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DataTable, HttpResult } from '../data/base-data';
import {
  NotificationTemplateData,
  NotificationTemplateEdit,
  NotificationTemplatePageQuery,
  NotificationTemplateVO,
} from '../data/notification-template';

@Injectable()
export class NotificationTemplateService extends NotificationTemplateData {

  baseUrl = '/notification/template';

  constructor(private apiService: ApiService) {
    super();
  }

  queryNotificationTemplatePage(param: NotificationTemplatePageQuery): Observable<DataTable<NotificationTemplateVO>> {
    return this.apiService.post(this.baseUrl, '/page/query', param);
  }

  updateNotificationTemplate(param: NotificationTemplateEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.put(this.baseUrl, '/update', param);
  }

  addNotificationTemplate(param: NotificationTemplateEdit): Observable<HttpResult<Boolean>> {
    return this.apiService.post(this.baseUrl, '/add', param);
  }

}
