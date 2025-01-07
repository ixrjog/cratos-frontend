import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import {
  ApplicationResourceBaselinePageQuery,
  ApplicationResourceBaselineVO,
} from '../../../../@core/data/application-resource-baseline';
import { ApplicationResourceBaselineService } from '../../../../@core/services/application-resource-baseline.service';
import { DataTableComponent, ICategorySearchTagItem } from 'ng-devui';
import { getRowColor, onFetchData } from '../../../../@shared/utils/data-table.utli';
import { ApplicationPageQuery, ApplicationVO } from '../../../../@core/data/application';
import { map } from 'rxjs/operators';
import { ApplicationService } from '../../../../@core/services/application.service';
import { finalize, Observable, zip } from 'rxjs';

@Component({
  selector: 'app-application-resource-baseline-data-table',
  templateUrl: './application-resource-baseline-data-table.component.html',
  styleUrls: [ './application-resource-baseline-data-table.component.less' ],
})
export class ApplicationResourceBaselineDataTableComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    applicationName: '',
    namespace: '',
    framework: '',
    standard: null,
    isQueryCanary: false,
  };
  memberType: {
    baselineType: string;
    standard: boolean;
  } = null;
  showCascader: boolean = false;
  showCategorySearch: boolean = false;
  application: ApplicationVO;
  table: Table<ApplicationResourceBaselineVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };
  baselineTypeOptions = [];
  selectedTags: ICategorySearchTagItem[] = [];

  category: ICategorySearchTagItem[] = [
    {
      label: 'Framework',
      field: 'framework',
      type: 'textInput',
      group: 'Basic',
    },
    {
      label: 'Standard',
      field: 'standard',
      type: 'radio',
      group: 'Status',
      options: [
        { label: 'true', value: true }, { label: 'false', value: false },
      ],
    }
  ];
  groupOrderConfig = [ 'Basic', 'Status' ];

  constructor(
    private applicationResourceBaselineService: ApplicationResourceBaselineService,
    private applicationService: ApplicationService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: ApplicationResourceBaselinePageQuery = {
      ...this.queryParam,
      byMemberType: this.memberType === null ? null : {
        baselineType: this.memberType.baselineType,
        standard: this.memberType.standard,
      },
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.applicationResourceBaselineService.queryApplicationResourceBaselinePage(param));
  }

  ngOnInit() {
    this.getBaselineTypeOptions();
    this.getNamespaceOptions();
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

  onScanAll() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.scanAll,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.applicationResourceBaselineService.scanAllBaseline()
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.SCAN);
          this.fetchData();
        });
    });
  }

  finalSearchItems: any;
  finalSearchKey: any;
  extendedConfig = { more: { show: true } };

  searchEvent(event) {
    this.finalSearchItems = event ? event.selectedTags : {};
    this.finalSearchKey = event ? event.searchKey : '';
  }

  selectedTagsChange(event) {
    this.queryParam.namespace = '';
    this.queryParam.framework = '';
    this.queryParam.standard = null;
    this.queryParam.isQueryCanary = false;
    event.selectedTags.map(selectedTag => {
      switch (selectedTag.type) {
        case 'textInput':
          this.queryParam[selectedTag.field] = selectedTag.value.value;
          break;
        case 'radio':
          this.queryParam[selectedTag.field] = selectedTag.value.value.value;
          break;
        default:
          break;
      }
    });
  }

  protected readonly getRowColor = getRowColor;

  onRowMerge(rowItem: ApplicationResourceBaselineVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.merge,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.applicationResourceBaselineService.mergeToBaseline({ baselineId: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.MERGE);
          this.fetchData();
        });
    });
  }

  onRowRedeploy(rowItem: ApplicationResourceBaselineVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.redeploy,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.applicationResourceBaselineService.redeployBaselineDeployment({ baselineId: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.REDEPLOY);
          this.fetchData();
        });
    });
  }

  onRowRescan(rowItem: ApplicationResourceBaselineVO) {
    this.toastUtil.onCommonToast(TOAST_CONTENT.OPERATION);
    rowItem['$rescan'] = true;
    this.applicationResourceBaselineService.rescanBaselineById({ baselineId: rowItem.id })
      .pipe(
        finalize(() => {
          rowItem['$rescan'] = false;
        }))
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.SCAN);
        this.fetchData();
      });
  }

  onSearchApplication = (term: string) => {
    const param: ApplicationPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.applicationService.queryApplicationPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((application, index) => ({ id: index, option: application })),
        ),
      );
  };

  onApplicationChange(application: ApplicationVO) {
    this.queryParam.applicationName = application?.name;
  }

  getBaselineTypeOptions() {
    this.baselineTypeOptions = [];
    this.applicationResourceBaselineService.getBaselineTypeOptions()
      .subscribe(({ body }) => {
        body.options.map(baseline => {
          this.baselineTypeOptions.push({
            label: baseline.label,
            value: baseline.value,
            children: [
              {
                label: baseline.label + '=true',
                value: true,
              },
              {
                label: baseline.label + '=false',
                value: false,
              },
            ],
          });
        });
        this.showCascader = true;
      });
  }

  onMemberTypeChanges(value: any) {
    if (JSON.stringify(value)=== '[]') {
      this.memberType = null
    } else {
      this.memberType.baselineType = value[0];
      this.memberType.standard = value[1];
    }
  }

  onCheckboxChange(value) {
    this.queryParam.isQueryCanary = value;
  }

  onBatchRedeploy() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchRedeploy,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.applicationResourceBaselineService.redeployBaselineDeployment({ baselineId: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_REDEPLOY);
        this.fetchData();
      });
    });
  }

  onBatchRescan() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchScan,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.applicationResourceBaselineService.rescanBaselineById({ baselineId: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_SCAN);
        this.fetchData();
      });
    });
  }

  onBatchMerge() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.batchMerge,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => {
        obList.push(this.applicationResourceBaselineService.mergeToBaseline({ baselineId: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_MERGE);
        this.fetchData();
      });
    });
  }

  getNamespaceOptions() {
    let namespaceItem: ICategorySearchTagItem = {
      label: 'Namespace',
      field: 'namespace',
      type: 'radio',
      group: 'Basic',
      options: [],
    };
    this.applicationService.getResourceNamespaceOptions()
      .subscribe(({ body }) => {
        body.options.map(namespace => {
          namespaceItem.options.push(namespace);
        });
        this.category.push(namespaceItem);
        this.showCategorySearch = true;
      });
  }
}
