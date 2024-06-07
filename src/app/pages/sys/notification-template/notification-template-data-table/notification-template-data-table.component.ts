import { Component, OnInit } from '@angular/core';
import { RbacResourceVO } from '../../../../@core/data/rbac';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { ToastUtil } from '../../../../@shared/utils/toast.util';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { NotificationTemplatePageQuery, NotificationTemplateVO } from '../../../../@core/data/notification-template';
import {
  NotificationTemplateEditorComponent,
} from './notification-template-editor/notification-template-editor.component';
import { NotificationTemplateService } from '../../../../@core/services/notification-template.service';

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
