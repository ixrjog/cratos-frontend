import { Component, Input, OnInit } from '@angular/core';
import { CratosAssetEdit } from '../../../../../../@core/data/ext-datasource';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';
import { ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { FormLayout } from 'ng-devui/form';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpResult } from '../../../../../../@core/data/base-data';

@Component({
  selector: 'app-eds-asset-batch-import',
  templateUrl: './eds-asset-batch-import.component.html',
  styleUrls: [ './eds-asset-batch-import.component.less' ],
})
export class EdsAssetBatchImportComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: CratosAssetEdit;
  batchImportData: string = '';
  operationType: boolean;
  importExample: string = 'Computer Name | Computer ID | Remote Management IP | Region';

  constructor(private edsService: EdsService,
              private toastUtil: ToastUtil) {
  }

  onDataChange(data: string) {
    this.batchImportData = data;
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  submitForm({ valid, directive }) {
    const lines = this.batchImportData.split('\n').filter(line => line.trim());
    let obList: Observable<HttpResult<Boolean>>[] = [];
    const lineData: { index: number; name: string }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const [ name, assetId, assetKey, region ] = lines[i].split('|').map(s => s.trim());
      const param: CratosAssetEdit = {
        ...this.formData,
        name,
        assetId,
        assetKey,
        region,
      };
      lineData.push({ index: i + 1, name });
      obList.push(
        this.edsService.addInstanceCratosAsset(param).pipe(
          catchError(() => of({ success: false } as HttpResult<Boolean>))
        )
      );
    }

    forkJoin(obList).subscribe({
      next: (results) => {
        const failures = results
          .map((result, index) => ({ result, ...lineData[index] }))
          .filter(item => !item.result.success);

        if (failures.length === 0) {
          this.toastUtil.onSuccessToast(`批量导入成功，共 ${lines.length} 条`);
        } else {
          const failInfo = failures.map(f => `第${f.index}行(${f.name})`).join('、');
          this.toastUtil.onCommonToast(`导入完成：成功 ${lines.length - failures.length} 条，失败 ${failures.length} 条。失败项：${failInfo}`);
        }
      }
    });
  }

}
