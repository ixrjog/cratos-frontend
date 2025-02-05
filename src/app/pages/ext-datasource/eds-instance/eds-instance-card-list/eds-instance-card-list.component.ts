import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessTypeEnum } from '../../../../@core/data/business';
import { Table } from '../../../../@core/data/base-data';
import { EdsInstanceVO, InstancePageQuery } from '../../../../@core/data/ext-datasource';
import { EdsService } from '../../../../@core/services/ext-datasource.service.s';
import { onFetchValidData } from '../../../../@shared/utils/data-table.utli';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import {
  BusinessCascaderComponent
} from '../../../../@shared/components/common/business-cascader/business-cascader.component';

@Component({
  selector: 'app-eds-instance-card-list',
  templateUrl: './eds-instance-card-list.component.html',
  styleUrls: [ './eds-instance-card-list.component.less' ],
})
export class EdsInstanceCardListComponent implements OnInit {


  @ViewChild('businessCascader') private businessCascader: BusinessCascaderComponent;

  queryParam = {
    queryName: '',
    edsType: '',
    queryByTag: {
      tagId: null,
      tagValue: null,
    },
  };
  businessType: string = BusinessTypeEnum.EDS_INSTANCE;

  edsTypeOptions = [];

  table: Table<EdsInstanceVO> = {
    loading: false,
    data: [],
    pager: {
      pageIndex: 1,
      pageSize: 12,
      total: 0,
    },
  };

  constructor(private edsService: EdsService) {
  }

  fetchData() {
    const param: InstancePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.edsService.queryEdsInstancePage(param));
  }

  onTagChanges(value: any) {
    this.queryParam.queryByTag = value;
  }

  getEdsTypeOptions() {
    this.edsService.getEdsInstanceTypeOptions()
      .subscribe(({ body }) => {
        this.edsTypeOptions = body.options;
      });
  };

  ngOnInit() {
    setTimeout(() => {
      this.businessCascader.getTagOptions();
    }, 500);
    this.fetchData();
    this.getEdsTypeOptions();
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  onEdsTypeChange(edsType: string) {
    this.fetchData();
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;
}
