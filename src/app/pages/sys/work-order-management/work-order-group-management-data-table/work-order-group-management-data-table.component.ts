import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { WorkOrderGroupPageQuery, WorkOrderGroupVO } from '../../../../@core/data/work-order';
import { WorkOrderService } from '../../../../@core/services/work-order.service';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import {
  WorkOrderGroupManagementEditorComponent,
} from './work-order-group-management-editor/work-order-group-management-editor.component';

@Component({
  selector: 'app-work-order-group-management-data-table',
  templateUrl: './work-order-group-management-data-table.component.html',
  styleUrls: [ './work-order-group-management-data-table.component.less' ],
})
export class WorkOrderGroupManagementDataTableComponent implements OnInit {

  table: Table<WorkOrderGroupVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  queryParam = {
    queryName: '',
  };

  constructor(
    private workOrderService: WorkOrderService,
    private dialogUtil: DialogUtil) {
  }

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      width: '50%',
      content: WorkOrderGroupManagementEditorComponent,
    },
  };

  fetchData() {
    const param: WorkOrderGroupPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.workOrderService.queryWorkOrderGroupPage(param));
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }


  onRowEdit(rowItem: WorkOrderGroupVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Work Order Group',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  ngOnInit(): void {
    this.fetchData();
  }
}
