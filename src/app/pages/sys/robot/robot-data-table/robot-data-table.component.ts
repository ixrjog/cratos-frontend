import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { RobotEdit, RobotPageQuery, RobotVO } from '../../../../@core/data/robot';
import { RobotService } from '../../../../@core/services/robot.service';

@Component({
  selector: 'app-robot-data-table',
  templateUrl: './robot-data-table.component.html',
  styleUrls: [ './robot-data-table.component.less' ],
})
export class RobotDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
  };
  limit = RELATIVE_TIME_LIMIT;

  table: Table<RobotVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newRobot: RobotEdit = {
    expiredTime: null,
    username: '',
    name: '',
    valid: true,
    comment: '',
  };

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };
  protected readonly getRowColor = getRowColor;

  constructor(
    private robotService: RobotService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: RobotPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.robotService.queryRobotPage(param));
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
    this.dialogUtil.onRobotDialog(() => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newRobot)));
  }

  onRowRevoke(rowItem: RobotVO) {
    if (rowItem.valid) {
      const dialogDate = {
        ...this.dialogDate.warningOperateData,
        content: this.dialogDate.content.revoke,
      };
      this.dialogUtil.onDialog(dialogDate, () => {
        this.robotService.revokeRobot({ id: rowItem.id })
          .subscribe(() => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.REVOKE);
            this.fetchData();
          });
      });
    }
  }

  onBatchValid() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchRevoke,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        if (row.valid) {
          obList.push(this.robotService.revokeRobot({ id: row.id }));
        }
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_REVOKE);
        this.fetchData();
      });
    });
  }

}
