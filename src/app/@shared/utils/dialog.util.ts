import { Injectable } from '@angular/core';
import { DialogService } from 'ng-devui';

@Injectable()
export class DialogUtil {
  constructor(private dialogService: DialogService) {
  }

  onDialog(dialogDate: any, handler: Function) {
    const results = this.dialogService.open({
      ...dialogDate,
      buttons: [
        {
          cssClass: 'primary',
          text: 'Confirm',
          handler: ($event: Event) => {
            handler();
            results.modalInstance.hide();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }
}
