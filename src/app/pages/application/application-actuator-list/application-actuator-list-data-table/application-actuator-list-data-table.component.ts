import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { ApplicationActuatorPageQuery, ApplicationActuatorVO } from '../../../../@core/data/application-actuator';
import { ApplicationActuatorService } from '../../../../@core/services/application-actuator.service';
import { ICategorySearchTagItem } from 'ng-devui';
import { getRowColor, onFetchData } from '../../../../@shared/utils/data-table.utli';
import { ApplicationPageQuery, ApplicationVO } from '../../../../@core/data/application';
import { map } from 'rxjs/operators';
import { ApplicationService } from '../../../../@core/services/application.service';

@Component({
  selector: 'app-application-actuator-list-data-table',
  templateUrl: './application-actuator-list-data-table.component.html',
  styleUrls: [ './application-actuator-list-data-table.component.less' ],
})
export class ApplicationActuatorListDataTableComponent implements OnInit {

  queryParam = {
    applicationName: '',
    namespace: '',
    framework: '',
    standard: null,
    actuatorStandard: null,
    lifecycleStandard: null,
  };
  application: ApplicationVO;
  table: Table<ApplicationActuatorVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

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
    {
      label: 'ActuatorStandard',
      field: 'actuatorStandard',
      type: 'radio',
      group: 'Status',
      options: [
        { label: 'true', value: true }, { label: 'false', value: false },
      ],
    },
    {
      label: 'LifecycleStandard',
      field: 'lifecycleStandard',
      type: 'radio',
      group: 'Status',
      options: [
        { label: 'true', value: true }, { label: 'false', value: false },
      ],
    },
  ];
  groupOrderConfig = [ 'Basic', 'Status' ];

  constructor(
    private applicationActuatorService: ApplicationActuatorService,
    private applicationService: ApplicationService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: ApplicationActuatorPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.applicationActuatorService.queryApplicationActuatorPage(param));
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
    this.queryParam.actuatorStandard = null;
    this.queryParam.lifecycleStandard = null;
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
}
