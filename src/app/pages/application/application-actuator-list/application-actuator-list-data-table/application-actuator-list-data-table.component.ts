import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { ApplicationActuatorPageQuery, ApplicationActuatorVO } from '../../../../@core/data/application-actuator';
import { ApplicationActuatorService } from '../../../../@core/services/application-actuator.service';
import { ICategorySearchTagItem } from 'ng-devui';
import { finalize } from 'rxjs';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';

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
  };
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
      label: 'ApplicationName',
      field: 'applicationName',
      type: 'textInput',
      group: 'Basic',
    },
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
    private applicationActuatorService: ApplicationActuatorService,
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
    this.table.data = [];
    this.table.loading = true;
    this.applicationActuatorService.queryApplicationActuatorPage(param).pipe(
      finalize(() => {
        this.table.loading = false;
      }),
    ).subscribe(
      ({ body }) => {
        this.table.data = body.data;
        this.table.pager.total = body.totalNum;
        this.table.data.filter(row => !row.standard)
          .map(row => row['$rowClass'] = 'table-row-invalid');
      });
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
    this.queryParam.applicationName = '';
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
}
