import { Injectable } from '@angular/core';
import { ToastService } from 'ng-devui';

@Injectable()
export class ToastUtil {

  constructor(private toastService: ToastService) {
  }

  onSuccessToast(content: string, style?: any) {
    this.toastService.open({
      value: [ { severity: 'success', summary: 'Success', content: content } ],
      life: 2000,
      style: style,
    });
  }

  onErrorToast(content: string, style?: any) {
    this.toastService.open({
      value: [ { severity: 'error', summary: 'Error', content: content } ],
      life: 2000,
      style: style,
    });
  }

}

export const TOAST_CONTENT = {
  ADD: 'Add success',
  UPDATE: 'Update success',
  DELETE: 'Delete success',
  INACTIVE: 'Inactive success',
  IMPORT: 'Importing, please wait',
  BATCH_UPDATE: 'Batch update success',
  BATCH_DELETE: 'Batch delete success',
  BATCH_INACTIVE: 'Batch inactive success',
};
