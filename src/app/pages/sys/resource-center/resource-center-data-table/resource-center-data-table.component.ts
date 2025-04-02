import { Component, ViewChild } from '@angular/core';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { getRowColor, onFetchData } from '../../../../@shared/utils/data-table.utli';
import { EdsAssetVO } from '../../../../@core/data/ext-datasource';
import { TagGroupService } from '../../../../@core/services/tag-group.service';
import { GetGroupOptions, TagGroupAssetPageQuery } from '../../../../@core/data/tag-group';
import { map } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { EdsService } from '../../../../@core/services/ext-datasource.service.s';
import { DataTableComponent } from 'ng-devui';
import { getPopoverStyle } from '../../../../@shared/utils/theme.util';
import { getResourceCountColor, parseResourceCount } from '../../../../@shared/utils/resource-count.util';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-resource-center-data-table',
  templateUrl: './resource-center-data-table.component.html',
  styleUrls: [ './resource-center-data-table.component.less' ],
})
export class ResourceCenterDataTableComponent {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;

  queryParam = {
    tagGroup: '',
    queryName: '',
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  businessType: string = BusinessTypeEnum.EDS_ASSET;
  resourceType = 'TAG';
  resourceTypeOptions = [ 'TAG' ];
  tag = 'Group';
  tagOptions = [ 'Group' ];
  table: Table<EdsAssetVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(private tagGroupService: TagGroupService,
              private edsService: EdsService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  fetchData() {
    const param: TagGroupAssetPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.tagGroupService.queryTagGroupAssetPage(param));
  }

  onSearchTagGroup = (term: string) => {
    const param: GetGroupOptions = {
      queryName: term,
    };
    return this.tagGroupService.getGroupOptions(param)
      .pipe(
        map(({ body }) =>
          body.options.map((option, index) => ({ id: index, option: option })),
        ),
      );
  };

  onTagGroupChange(option: any) {
    this.queryParam.tagGroup = option?.value;
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  onRowValid(rowItem: EdsAssetVO) {
    this.edsService.setEdsInstanceAssetValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowBusinessTag(rowItem: EdsAssetVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: EdsAssetVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onBatchDelete() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchDelete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.edsService.deleteEdsInstanceAssetById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
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
        obList.push(this.edsService.setEdsInstanceAssetValidById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
        this.fetchData();
      });
    });
  }

  onBatchTag() {
    this.dialogUtil.onBusinessTagBatchEditDialog(
      this.businessType, this.datatable.getCheckedRows(), () => this.fetchData());
  }

  protected readonly getPopoverStyle = getPopoverStyle;
  protected readonly getRowColor = getRowColor;
  protected readonly parseResourceCount = parseResourceCount;
  protected readonly getResourceCountColor = getResourceCountColor;
  protected readonly limit = RELATIVE_TIME_LIMIT;
}
