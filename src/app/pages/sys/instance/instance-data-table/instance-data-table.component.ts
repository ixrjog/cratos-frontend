import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { CratosInstanceVO, RegisteredInstancePageQuery } from '../../../../@core/data/cratos-instance';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { CratosInstanceService } from '../../../../@core/services/cratos-instance.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import {
  BusinessCascaderComponent
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';

@Component({
  selector: 'app-instance-data-table',
  templateUrl: './instance-data-table.component.html',
  styleUrls: [ './instance-data-table.component.less' ],
})
export class InstanceDataTableComponent implements OnInit {
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;

  protected readonly limit = RELATIVE_TIME_LIMIT;
  businessType: string = BusinessTypeEnum.CRATOS_INSTANCE;

  private static STORAGE_KEY = 'instance-query';

  queryParam = {
    queryName: '',
    valid: null,
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };

  table: Table<CratosInstanceVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(private cratosInstanceService: CratosInstanceService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  fetchData() {
    sessionStorage.setItem(InstanceDataTableComponent.STORAGE_KEY, JSON.stringify(this.queryParam));
    const param: RegisteredInstancePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.cratosInstanceService.queryRegisteredInstancePage(param));
  }

  ngOnInit() {
    const saved = sessionStorage.getItem(InstanceDataTableComponent.STORAGE_KEY);
    if (saved) {
      Object.assign(this.queryParam, JSON.parse(saved));
    }
    setTimeout(() => {
      this.businessCascader.getTagOptions();
    }, 500);
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

  protected readonly getRowColor = getRowColor;

  onRowBusinessTag(rowItem: CratosInstanceVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowValid(rowItem: CratosInstanceVO) {
    this.cratosInstanceService.setInstanceValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: CratosInstanceVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.cratosInstanceService.deleteInstanceById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }
}
