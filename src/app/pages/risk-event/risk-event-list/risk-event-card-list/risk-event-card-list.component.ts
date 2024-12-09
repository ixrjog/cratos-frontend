import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { Table } from '../../../../@core/data/base-data';
import { onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/utils/data.util';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { RiskEventEdit, RiskEventPageQuery, RiskEventVO } from '../../../../@core/data/risk-event';
import { RiskEventEditorComponent } from './risk-event-editor/risk-event-editor.component';
import { RiskEventService } from '../../../../@core/services/risk-event.service';
import { ICategorySearchTagItem } from 'ng-devui';
import {
  BusinessCascaderComponent
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';

@Component({
  selector: 'app-risk-event-card-list',
  templateUrl: './risk-event-card-list.component.html',
  styleUrls: [ './risk-event-card-list.component.less' ],
})
export class RiskEventCardListComponent implements OnInit {

  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;

  queryParam = {
    queryName: '',
    year: '',
    quarter: '',
    sla: null,
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };

  selectedTags: ICategorySearchTagItem[] = [];
  show = false;
  category: ICategorySearchTagItem[] = [
    {
      label: 'QueryName',
      field: 'queryName',
      type: 'textInput',
      group: 'Basic',
    },
    {
      label: 'SLA',
      field: 'sla',
      type: 'radio',
      group: 'Status',
      options: [
        { label: 'true', value: true }, { label: 'false', value: false },
      ],
    },
    {
      label: 'Quarter',
      field: 'quarter',
      type: 'radio',
      group: 'Time Related',
      options: [
        { label: 'Q1', value: '1' }, { label: 'Q2', value: '2' },
        { label: 'Q3', value: '3' }, { label: 'Q4', value: '4' },
      ],
    },
  ];

  groupOrderConfig = [ 'Basic', 'Status', 'Time Related' ];
  businessType: string = BusinessTypeEnum.RISK_EVENT;

  table: Table<RiskEventVO> = {
    loading: false,
    data: [],
    pager: {
      pageIndex: 1,
      pageSize: 4,
      total: 0,
    },
  };

  dialogDate = {
    editorData: {
      ...DIALOG_DATA.editorData,
      content: RiskEventEditorComponent,
    },
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  newRiskEvent: RiskEventEdit = {
    comment: '',
    eventTime: undefined,
    name: '',
    states: '',
    valid: true,
  };

  constructor(private riskEventService: RiskEventService,
              private dialogUtil: DialogUtil) {
  }

  fetchData() {
    const param: RiskEventPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.riskEventService.queryRiskEventPage(param));
  }

  ngOnInit() {
    setTimeout(() => {
      this.businessCascader.getTagOptions();
    }, 500);
    this.getYearOptions();
    this.fetchData();
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;

  onRowNew() {
    const dialogDate = {
      ...this.dialogDate.editorData,
      title: 'New Risk Event',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, dialogDate, () => {
      this.fetchData();
    }, JSON.parse(JSON.stringify(this.newRiskEvent)));
  }

  finalSearchItems: any;
  finalSearchKey: any;
  extendedConfig = { more: { show: true } };

  searchEvent(event) {
    this.finalSearchItems = event ? event.selectedTags : {};
    this.finalSearchKey = event ? event.searchKey : '';
  }

  selectedTagsChange(event) {
    this.queryParam.sla = null;
    this.queryParam.quarter = '';
    this.queryParam.year = '';
    this.queryParam.queryName = '';
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

  getYearOptions() {
    let yearItem: ICategorySearchTagItem = {
      label: 'Year',
      field: 'year',
      type: 'radio',
      group: 'Time Related',
      options: [],
    };
    this.riskEventService.getYearOptions()
      .subscribe(({ body }) => {
        body.options.map(year => {
          yearItem.options.push(year);
        });
        this.category.push(yearItem);
        this.show = true;
      });
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }
}
