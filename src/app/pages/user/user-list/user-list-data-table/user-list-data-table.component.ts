import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { finalize, Observable, zip } from 'rxjs';
import { UserEdit, UserPageQuery, UserVO } from '../../../../@core/data/user';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { UserService } from '../../../../@core/services/user.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-user-list-data-table',
  templateUrl: './user-list-data-table.component.html',
  styleUrls: [ './user-list-data-table.component.less' ],
})
export class UserListDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
  };
  limit = RELATIVE_TIME_LIMIT;
  businessType: string = BusinessTypeEnum.USER;

  table: Table<UserVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newUser: UserEdit = {
    comment: '',
    displayName: '',
    email: '',
    expiredTime: null,
    mobilePhone: '',
    name: '',
    otp: 0,
    username: '',
    valid: true,
  };

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private userService: UserService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: UserPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.userService.queryUserPage(param));
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
      title: 'New User',
    };
    this.dialogUtil.onUserEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, this.newUser);
  }

  onRowEdit(rowItem: UserVO) {
    const dialogDate = {
      title: 'Edit User',
    };
    this.dialogUtil.onUserEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowInactive(rowItem: UserVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.inactive,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.userService.inactiveUser({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.INACTIVE);
          this.fetchData();
        });
    });
  }

  onRowValid(rowItem: UserVO) {
    this.userService.setUserValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onBatchValid() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchValid,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.userService.setUserValidById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
        this.fetchData();
      });
    });
  }

  onBatchInactive() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchInactive,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.userService.inactiveUser({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_INACTIVE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: UserVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: UserVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onCellEditEnd(event) {
    const param: UserEdit = {
      id: event.rowItem.id,
      name: event.rowItem.name,
      username: event.rowItem.username,
      displayName: event.rowItem.displayName,
      email: event.rowItem.email,
      mobilePhone: event.rowItem.mobilePhone,
      comment: event.rowItem.comment,
      valid: event.rowItem.valid,
      expiredTime: event.rowItem.expiredTime,
      otp: event.rowItem.otp,
    };
    this.userService.updateUser(param)
      .pipe(
        catchError((error: any) => {
          this.fetchData();
          return new error();
        }),
      )
      .subscribe();
  }

  protected readonly getRowColor = getRowColor;
}
