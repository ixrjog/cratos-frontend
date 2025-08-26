import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  BusinessUserPermissionDetailsVO, GrantUserPermission,
  UserPermissionBusinessVO,
  UserPermissionVO,
} from '../../../../../@core/data/user-permission';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { UserPermissionService } from '../../../../../@core/services/user-permission.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: [ './user-permissions.component.less' ],
})
export class UserPermissionsComponent implements OnInit {

  @Input() userPermissions: Map<string, UserPermissionBusinessVO[]>;
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
    private toastUtil: ToastUtil,
    private translate: TranslateService) {
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

  /**
   * 获取紧凑的过期时间文本
   */
  getCompactExpirationText(expiredTime: Date): string {
    if (!expiredTime) {
      return ''; // 不显示任何内容
    }
    
    const now = new Date();
    const timeDiff = new Date(expiredTime).getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return `${this.translate.instant('user.permissions.expiration.expired')} ${Math.abs(daysDiff)} ${this.translate.instant('user.permissions.expiration.days')}`;
    } else if (daysDiff === 0) {
      return this.translate.instant('user.permissions.expiration.today');
    } else if (daysDiff <= 30) {
      return `${daysDiff} ${this.translate.instant('user.permissions.expiration.days')}`;
    } else {
      const date = new Date(expiredTime);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}-${day}`;
    }
  }

  /**
   * 获取详细的过期时间提示（用于tooltip）
   */
  getExpirationTooltip(expiredTime: Date): string {
    if (!expiredTime) {
      return ''; // 不显示tooltip
    }
    
    const date = new Date(expiredTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${this.translate.instant('user.permissions.expiration.tooltipPrefix')}${year}-${month}-${day} ${hours}:${minutes}`;
  }

  /**
   * 获取过期时间的颜色
   */
  getExpirationColor(expiredTime: Date): string {
    if (!expiredTime) {
      return '#52c41a'; // 绿色 - 永久有效
    }
    
    const now = new Date();
    const timeDiff = new Date(expiredTime).getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return '#ff4d4f'; // 红色 - 已过期
    } else if (daysDiff <= 3) {
      return '#ff7875'; // 浅红色 - 3天内过期
    } else if (daysDiff <= 7) {
      return '#ffa940'; // 橙色 - 7天内过期
    } else if (daysDiff <= 30) {
      return '#faad14'; // 黄色 - 30天内过期
    } else {
      return '#52c41a'; // 绿色 - 正常
    }
  }

  /**
   * 根据过期时间获取进度条颜色
   */
  getProgressColor(expiredTime: Date): string {
    if (!expiredTime) {
      return '#50d4ab'; // 默认绿色
    }
    
    const now = new Date();
    const timeDiff = new Date(expiredTime).getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return '#ff4d4f'; // 红色 - 已过期
    } else if (daysDiff <= 7) {
      return '#ffa940'; // 橙色 - 即将过期
    } else {
      return '#50d4ab'; // 绿色 - 正常
    }
  }
}

