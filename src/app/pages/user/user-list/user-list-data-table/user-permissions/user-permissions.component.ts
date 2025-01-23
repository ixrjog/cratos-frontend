import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  BusinessUserPermissionDetailsVO, GrantUserPermission,
  UserPermissionBusinessVO,
  UserPermissionVO,
} from '../../../../../@core/data/user-permission';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { UserPermissionService } from '../../../../../@core/services/user-permission.service';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: [ './user-permissions.component.less' ],
})
export class UserPermissionsComponent implements OnInit {

  @Input() userPermissions: BusinessUserPermissionDetailsVO;
  @Output() onFetchData = new EventEmitter<any>();

  permissionMap: Map<string, UserPermissionBusinessVO[]> = new Map();
  protected readonly JSON = JSON;

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private userPermissionService: UserPermissionService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    if (this.userPermissions === null) {
      return;
    }
    const map = new Map(Object.entries(this.userPermissions));
    map.forEach((value, key) => {
      this.permissionMap.set(key, value);
    });
  }

  onRowRemove(rowItem: UserPermissionVO) {
    if (rowItem.id === null) {
      const dialogDate = {
        ...this.dialogDate.warningOperateData,
        content: this.dialogDate.content.grant,
      };
      this.dialogUtil.onDialog(dialogDate, () => {
        const param: GrantUserPermission = {
          username: rowItem.username,
          businessType: rowItem.businessType,
          businessId: rowItem.businessId,
          role: rowItem.role,
        };
        this.userPermissionService.grantUserPermission(param)
          .subscribe(() => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
            this.onFetchData.emit();
          });
      });
    } else {
      const dialogDate = {
        ...this.dialogDate.warningOperateData,
        content: this.dialogDate.content.revoke,
      };
      this.dialogUtil.onDialog(dialogDate, () => {
        this.userPermissionService.revokeUserPermissionById({ id: rowItem.id })
          .subscribe(() => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
            this.onFetchData.emit();
          });
      });
    }
  }
}

