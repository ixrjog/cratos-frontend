import { Component } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import {
  WorkOrderGroupPageQuery,
  WorkOrderGroupVO,
  WorkOrderPageQuery,
  WorkOrderVO,
} from '../../../../@core/data/work-order';
import { WorkOrderService } from '../../../../@core/services/work-order.service';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import {
  WorkOrderManagementEditorComponent,
} from './work-order-management-editor/work-order-management-editor.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-work-order-management-data-table',
  templateUrl: './work-order-management-data-table.component.html',
  styleUrls: [ './work-order-management-data-table.component.less' ],
})
export class WorkOrderManagementDataTableComponent {

  table: Table<WorkOrderVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  queryParam = {
    queryName: '',
    groupId: null,
  };

  workOrderGroup: WorkOrderGroupVO;

  constructor(
    private workOrderService: WorkOrderService,
    private dialogUtil: DialogUtil) {
  }

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: WorkOrderManagementEditorComponent,
    },
  };

  fetchData() {
    const param: WorkOrderPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.workOrderService.queryWorkOrderPage(param));
  }

  onSearchWorkOrderGroup = (term: string) => {
    const param: WorkOrderGroupPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.workOrderService.queryWorkOrderGroupPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((workOrderGroup, index) => ({ id: index, option: workOrderGroup })),
        ),
      );
  };

  onWorkOrderGroupChange(workOrderGroup: WorkOrderGroupVO) {
    this.queryParam.groupId = workOrderGroup?.id;
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

}
