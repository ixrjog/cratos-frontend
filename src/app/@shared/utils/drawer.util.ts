import { Injectable } from '@angular/core';
import { ToastUtil } from './toast.util';
import { DrawerService } from 'ng-devui/drawer';

@Injectable()
export class DrawerUtil {

  constructor(private drawerService: DrawerService,
              private toastUtil: ToastUtil) {
  }

  onDrawer(drawerDate: any, data: any, onFetch?: Function, extend?: any) {
    const results = this.drawerService.open({
      ...drawerDate,
      // beforeHidden: () => this.beforeHidden(),
      onClose: () => {
        onFetch();
      },
      data: {
        formData: data,
        close: (event) => {
          results.drawerInstance.hide();
        },
        fullScreen: (event) => {
          results.drawerInstance.toggleFullScreen();
        },
        ...extend,
      },
    });
  }
}

export const DRAWER_DATA = {
  editorData: {
    width: '40%',
    zIndex: 1000,
    isCover: true,
    fullScreen: true,
    backdropCloseable: false,
    escKeyCloseable: true,
    position: 'right',
  },
};
