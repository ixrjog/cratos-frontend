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

  onCommonToast(content: string, style?: any) {
    this.toastService.open({
      value: [ { severity: 'common', content: content } ],
      life: 2000,
      style: style,
    });
  }
}

export const TOAST_CONTENT = {
  ADD: 'Add success',
  UPDATE: 'Update success',
  DELETE: 'Delete success',
  REVOKE: 'Revoke success',
  MERGE: 'Merge success',
  INACTIVE: 'Inactive success',
  IMPORT: 'Importing, please wait',
  OPERATION: 'Operation in progress, please wait',
  SCAN: 'Scan success',
  UNREGISTER: 'Unregister success',
  BATCH_UPDATE: 'Batch update success',
  BATCH_DELETE: 'Batch delete success',
  BATCH_MERGE: 'Batch merge success',
  BATCH_SCAN: 'Batch scan success',
  BATCH_INACTIVE: 'Batch inactive success',
  BATCH_REVOKE: 'Batch revoke success',
};
