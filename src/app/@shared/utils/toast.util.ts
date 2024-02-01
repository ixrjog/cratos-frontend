import { Injectable } from '@angular/core';
import { ToastService } from 'ng-devui';

@Injectable()
export class ToastUtil {

  constructor(private toastService: ToastService) {
  }

  onSuccessToast(content: string) {
    this.toastService.open({
      value: [ { severity: 'success', summary: 'Success', content: content } ],
      life: 2000,
    });
  }

}

export const TOAST_CONTENT = {
  ADD: 'Add success',
  UPDATE: 'Update success',
  DELETE: 'Delete success',
  BATCH_UPDATE: 'Batch update success',
  BATCH_DELETE: 'Batch delete success',
};
