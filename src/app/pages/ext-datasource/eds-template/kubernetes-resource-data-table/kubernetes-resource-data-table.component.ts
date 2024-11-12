import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent, ICategorySearchTagItem } from 'ng-devui';
import { KubernetesResourcePageQuery, KubernetesResourceVO } from '../../../../@core/data/kubernetes-resource';
import { HttpResult, Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { KubernetesResourceService } from '../../../../@core/services/kubernetes-resource.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';

@Component({
  selector: 'app-kubernetes-resource-data-table',
  templateUrl: './kubernetes-resource-data-table.component.html',
  styleUrls: [ './kubernetes-resource-data-table.component.less' ],
})
export class KubernetesResourceDataTableComponent implements OnInit{

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    namespace: '',
    kind: '',
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
      label: 'Namespace',
      field: 'namespace',
      type: 'textInput',
      group: 'Basic',
    },
  ];
  groupOrderConfig = [ 'Basic' ];

  table: Table<KubernetesResourceVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private kubernetesResourceService: KubernetesResourceService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  fetchData() {
    const param: KubernetesResourcePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.kubernetesResourceService.queryResourcePage(param));
  }

  getResourceKindOptions() {
    let kindItem: ICategorySearchTagItem = {
      label: 'Kind',
      field: 'kind',
      type: 'radio',
      group: 'Basic',
      options: [],
    };
    this.kubernetesResourceService.getResourceKindOptions()
      .subscribe(({ body }) => {
        body.options.map(kind => {
          kindItem.options.push(kind);
        });
        this.category.push(kindItem);
        this.show = true;
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
    this.queryParam.kind = '';
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

  init() {
    this.getResourceKindOptions();
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

  onRowDelete(rowItem: KubernetesResourceVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.kubernetesResourceService.deleteResourceById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
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
        obList.push(this.kubernetesResourceService.deleteResourceById({ id: row.id }));
      });
      zip(obList).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE);
        this.fetchData();
      });
    });
  }

  ngOnInit(): void {
  }

}
