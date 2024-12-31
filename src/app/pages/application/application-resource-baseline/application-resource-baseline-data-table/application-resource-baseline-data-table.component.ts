import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import {
  ApplicationResourceBaselinePageQuery,
  ApplicationResourceBaselineVO,
} from '../../../../@core/data/application-resource-baseline';
import { ApplicationResourceBaselineService } from '../../../../@core/services/application-resource-baseline.service';
import { ICategorySearchTagItem } from 'ng-devui';
import { getRowColor, onFetchData } from '../../../../@shared/utils/data-table.utli';
import { ApplicationPageQuery, ApplicationVO } from '../../../../@core/data/application';
import { map } from 'rxjs/operators';
import { ApplicationService } from '../../../../@core/services/application.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-application-resource-baseline-data-table',
  templateUrl: './application-resource-baseline-data-table.component.html',
  styleUrls: [ './application-resource-baseline-data-table.component.less' ],
})
export class ApplicationResourceBaselineDataTableComponent implements OnInit {

  queryParam = {
    applicationName: '',
    namespace: '',
    framework: '',
    standard: null,
  };
  memberType: {
    baselineType: string;
    standard: boolean;
  } = null;
  show: boolean = false;
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
      label: 'Namespace',
      field: 'namespace',
      type: 'textInput',
      group: 'Basic',
    },
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
    },
  ];
  groupOrderConfig = [ 'Basic', 'Status' ];

  constructor(
    private applicationActuatorService: ApplicationResourceBaselineService,
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
    onFetchData(this.table, this.applicationActuatorService.queryApplicationResourceBaselinePage(param));
  }

  ngOnInit() {
    this.getBaselineTypeOptions();
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
      this.applicationActuatorService.scanApplicationActuator()
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

  onRowFix(rowItem) {
  }

  onRowRescan(rowItem: ApplicationResourceBaselineVO) {
    this.toastUtil.onCommonToast(TOAST_CONTENT.OPERATION);
    rowItem['$rescan'] = true;
    this.applicationActuatorService.rescanBaselineById({ baselineId: rowItem.id })
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
    this.applicationActuatorService.getBaselineTypeOptions()
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
        this.show = true;
      });
  }

  onMemberTypeChanges(value: any) {
    this.memberType.baselineType = value[0];
    this.memberType.standard = value[1];
  }
}
