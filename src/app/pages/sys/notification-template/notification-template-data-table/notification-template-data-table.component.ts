import { Component, OnInit } from '@angular/core';
import { RbacResourceVO } from '../../../../@core/data/rbac';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import {
  NotificationTemplateEdit,
  NotificationTemplatePageQuery,
  NotificationTemplateVO,
} from '../../../../@core/data/notification-template';
import {
  NotificationTemplateEditorComponent,
} from './notification-template-editor/notification-template-editor.component';
import { NotificationTemplateService } from '../../../../@core/services/notification-template.service';
import { EnvEdit } from '../../../../@core/data/env';

@Component({
  selector: 'app-notification-template-data-table',
  templateUrl: './notification-template-data-table.component.html',
  styleUrls: [ './notification-template-data-table.component.less' ],
})
export class NotificationTemplateDataTableComponent implements OnInit {

  queryParam = {
    queryName: '',
  };

  table: Table<NotificationTemplateVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newNotificationTemplate: NotificationTemplateEdit = {
    comment: '',
    consumer: '',
    content: '',
    lang: '',
    name: '',
    notificationTemplateKey: '',
    notificationTemplateType: '',
    title: ''
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      width: '60%',
      maxHeight: '1000px',
      content: NotificationTemplateEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private notificationTemplateService: NotificationTemplateService,
    private dialogUtil: DialogUtil
  ) {
  }

  fetchData() {
    const param: NotificationTemplatePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.notificationTemplateService.queryNotificationTemplatePage(param));
  }

  ngOnInit() {
    this.fetchData();
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Notification Template',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newNotificationTemplate)));
  }

  onRowEdit(rowItem: RbacResourceVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Notification Template',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

}
