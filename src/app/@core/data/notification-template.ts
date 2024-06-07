import { BaseVO, DataTable, HttpResult, PageQuery } from './base-data';
import { Observable } from 'rxjs';

export interface NotificationTemplateVO extends BaseVO {
  id: number;
  name: string;
  notificationTemplateKey: string;
  notificationTemplateType: string;
  title: string;
  consumer: string;
  lang: string;
  content: string;
  comment: string;
}

export interface NotificationTemplateEdit {
  id: number;
  name: string;
  notificationTemplateKey: string;
  notificationTemplateType: string;
  title: string;
  consumer: string;
  lang: string;
  content: string;
  comment: string;
}

export interface NotificationTemplatePageQuery extends PageQuery {
  queryName: string;
}

export abstract class NotificationTemplateData {

  abstract queryNotificationTemplatePage(param: NotificationTemplatePageQuery): Observable<DataTable<NotificationTemplateVO>>;

  abstract updateNotificationTemplate(param: NotificationTemplateEdit): Observable<HttpResult<Boolean>>;

}
