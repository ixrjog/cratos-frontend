import { Component, OnInit, ViewChild } from '@angular/core';
import { FinOpsService } from '../../../../@core/services/finops.service';
import { AllocationCategory } from '../../../../@core/data/finops';
import { FormLayout } from 'ng-devui/form';
import { ToastUtil } from '../../../../@shared/utils/toast.util';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { AceEditorComponent } from '../../../../@shared/components/common/ace-editor/ace-editor.component';

@Component({
  selector: 'app-finops-app-cost-detail',
  templateUrl: './finops-app-cost-detail.component.html',
  styleUrls: [ './finops-app-cost-detail.component.less' ],
})
export class FinopsAppCostDetailComponent implements OnInit {


  @ViewChild('appCostDataAce') private appCostDataAce: AceEditorComponent;
  allocationCategories: AllocationCategory[] = [];
  costTable: string = '';
  costDetailsTable: string = '';
  appCostData: string = '';

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(private finOpsService: FinOpsService,
              private toastUtil: ToastUtil,
              private dialogUtil: DialogUtil) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  onRowImport() {
    try {
      this.allocationCategories = JSON.parse(this.appCostData);
    } catch (e) {
      this.toastUtil.onErrorToast(e.message);
    }
  }

  onRowExport() {
    this.allocationCategories = this.allocationCategories.filter(item => item.name !== '' && item.amount !== 0);
    this.appCostData = JSON.stringify(this.allocationCategories, null, 2);
    this.appCostDataAce.onWrite(this.appCostData);
  }

  onRowClear() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.clear,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.allocationCategories = [];
    });
  }

  onAddAppCost() {
    this.allocationCategories.push({ name: '', currencyCode: 'CNY', amount: 0 });
  }

  onDataChange(data: string) {
    this.appCostData = data;
  }

  onRowDelete(index: number) {
    this.allocationCategories.splice(index, 1);
  }

  fetchData() {
    this.costTable = '';
    this.costDetailsTable = '';
    this.finOpsService.queryAppCost({
      allocationCategories: this.allocationCategories.filter(item => item.name !== '' && item.amount !== 0),
    }).subscribe(({ body }) => {
      this.costTable = body.costTable;
      this.costDetailsTable = body.costDetailsTable;
    });
  }

  protected readonly FormLayout = FormLayout;
  protected readonly Number = Number;
}
