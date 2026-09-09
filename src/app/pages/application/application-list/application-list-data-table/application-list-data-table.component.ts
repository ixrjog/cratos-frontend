import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { finalize, Observable, zip } from 'rxjs';
import { ApplicationEdit, ApplicationPageQuery, ApplicationVO, ScanResource } from '../../../../@core/data/application';
import { ApplicationEditorComponent } from './application-editor/application-editor.component';
import { ApplicationService } from '../../../../@core/services/application.service';
import {
  BusinessCascaderComponent,
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';
import { UserPermissionService } from '../../../../@core/services/user-permission.service';
import {
  QueryBusinessUserPermissionDetails,
  QueryUserPermissionByBusiness,
} from '../../../../@core/data/user-permission';
import { getPopoverStyle } from '../../../../@shared/utils/theme.util';
import { UserFavoriteService } from '../../../../@core/services/user-favorite.service';
import { AddUserFavorite, RemoveUserFavorite } from '../../../../@core/data/user-favorite';

@Component({
  selector: 'app-application-list-data-table',
  templateUrl: './application-list-data-table.component.html',
  styleUrls: [ './application-list-data-table.component.less' ],
})
export class ApplicationListDataTableComponent implements OnInit {

  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };
  businessType: string = BusinessTypeEnum.APPLICATION;
  table: Table<ApplicationVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  newApplication: ApplicationEdit = {
    name: '',
    config: '',
    comment: '',
    valid: true,
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: ApplicationEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private applicationService: ApplicationService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
    private userPermissionService: UserPermissionService,
    private userFavoriteService: UserFavoriteService,
  ) {
  }

  fetchData() {
    this.persistQueryParam();
    const param: ApplicationPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.applicationService.queryApplicationPage(param));
  }

  ngOnInit() {
    this.restoreQueryParam();
    setTimeout(() => {
      // 恢复的标签筛选值传给级联组件回显
      this.businessCascader.initialValue = this.queryParam.queryByTag;
      this.businessCascader.getTagOptions();
    }, 500);
    this.fetchData();
    this.loadFavoriteApplications();
  }

  /** 我收藏的应用(搜索栏下方展示, 点击快速筛选) */
  favoriteApplicationList: ApplicationVO[] = [];

  loadFavoriteApplications() {
    this.userFavoriteService.getMyFavoriteApplication()
      .subscribe(({ body }) => {
        this.favoriteApplicationList = body || [];
      });
  }

  /** 点击收藏的应用: 填入搜索名并查询 */
  onSelectFavorite(application: ApplicationVO) {
    this.queryParam.queryName = application.name;
    this.table.pager.pageIndex = 1;
    this.fetchData();
  }

  /** 取消收藏(从收藏区的 x) */
  onRemoveFavorite(application: ApplicationVO) {
    const param: RemoveUserFavorite = {
      businessType: this.businessType,
      businessId: application.id,
    };
    this.userFavoriteService.removeApplicationFavorite(param)
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
        this.loadFavoriteApplications();
        // 同步刷新列表中该行的收藏态
        this.fetchData();
      });
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
      title: 'New Application',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newApplication)));
  }

  onRowEdit(rowItem: ApplicationVO) {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'Edit Application',
    };
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, dialogDate, () => {
      this.fetchData();
    }, rowItem);
  }

  onRowValid(rowItem: ApplicationVO) {
    this.applicationService.setApplicationValidById({ id: rowItem.id })
      .subscribe(() => {
        this.fetchData();
      });
  }

  onRowDelete(rowItem: ApplicationVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.applicationService.deleteApplicationById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  onRowScan(rowItem: ApplicationVO) {
    const param: ScanResource = {
      name: rowItem.name,
    };
    this.toastUtil.onCommonToast(TOAST_CONTENT.OPERATION);
    rowItem['$scan'] = true
    this.applicationService.scanApplicationResource(param)
      .pipe(
        finalize(() => {
          rowItem['$scan'] = false
        }))
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.SCAN);
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
        obList.push(this.applicationService.setApplicationValidById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_UPDATE);
        this.fetchData();
      });
    });
  }

  onBatchDelete() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchDelete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.applicationService.deleteApplicationById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  onRowBusinessTag(rowItem: ApplicationVO) {
    this.dialogUtil.onBusinessTagEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onBatchTag() {
    this.dialogUtil.onBusinessTagBatchEditDialog(
      this.businessType, this.datatable.getCheckedRows(), () => this.fetchData());
  }

  onRowBusinessDoc(rowItem: ApplicationVO) {
    this.dialogUtil.onBusinessDocsEditDialog(this.businessType, rowItem, () => this.fetchData());
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }

  /** 收藏/取消收藏应用(复用 user-favorite) */
  onToggleFavorite(rowItem: ApplicationVO) {
    if (rowItem.favorited) {
      const param: RemoveUserFavorite = {
        businessType: this.businessType,
        businessId: rowItem.id,
      };
      this.userFavoriteService.removeApplicationFavorite(param)
        .subscribe(() => {
          rowItem.favorited = false;
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.loadFavoriteApplications();
        });
    } else {
      const param: AddUserFavorite = {
        businessType: this.businessType,
        businessId: rowItem.id,
      };
      this.userFavoriteService.addApplicationFavorite(param)
        .subscribe(() => {
          rowItem.favorited = true;
          this.toastUtil.onSuccessToast(TOAST_CONTENT.OPERATION);
          this.loadFavoriteApplications();
        });
    }
  }

  // ===== 搜索条件持久化 =====
  private static readonly QUERY_STORAGE_KEY = 'application_list_query';

  /** 保存当前搜索条件 */
  private persistQueryParam() {
    try {
      localStorage.setItem(ApplicationListDataTableComponent.QUERY_STORAGE_KEY, JSON.stringify(this.queryParam));
    } catch (e) {
      // 忽略 localStorage 异常
    }
  }

  /** 恢复搜索条件(合并默认结构, 防旧数据缺字段) */
  private restoreQueryParam() {
    try {
      const raw = localStorage.getItem(ApplicationListDataTableComponent.QUERY_STORAGE_KEY);
      if (!raw) {
        return;
      }
      const saved = JSON.parse(raw);
      this.queryParam = {
        queryName: saved.queryName ?? '',
        queryByTag: {
          tagId: saved.queryByTag?.tagId ?? null,
          tagValue: saved.queryByTag?.tagValue ?? null,
        },
      };
    } catch (e) {
      // 忽略解析异常
    }
  }

  onScanAll() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.scanAll,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.applicationService.scanAllApplicationResource()
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.SCAN);
          this.fetchData();
        });
    });
  }

  onApplicationPermission(rowItem: ApplicationVO) {
    rowItem['$show'] = false;
    rowItem['$permission'] = null;
    rowItem['$loading'] = true;
    const param: QueryUserPermissionByBusiness = {
      businessType: this.businessType,
      businessId: rowItem.id,
    };
    this.userPermissionService.queryUserPermissionByBusiness(param)
      .pipe(
        finalize(() => rowItem['$loading'] = false),
      )
      .subscribe(({ body }) => {
        rowItem['$permission'] = body.userPermissionsMap
        rowItem['$show'] = true;
      });
  }

  protected readonly getRowColor = getRowColor;
  protected readonly getPopoverStyle = getPopoverStyle;
}
