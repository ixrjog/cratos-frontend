import { Component, Input, OnInit } from '@angular/core';
import { UserVO } from '../../../../../../@core/data/user';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { UserPermissionService } from '../../../../../../@core/services/user-permission.service';
import { EnvService } from '../../../../../../@core/services/env.service';
import {
  GrantUserPermission,
  PermissionBusinessVO,
  QueryAllBusinessUserPermissionDetails,
  RevokeUserPermission,
  UserPermissionBusinessPageQuery,
  UserPermissionBusinessVO,
  UserPermissionVO,
} from '../../../../../../@core/data/user-permission';
import { finalize } from 'rxjs';
import { EnvPageQuery } from '../../../../../../@core/data/env';
import { BusinessTypeEnum } from '../../../../../../@core/data/business';
import { map } from 'rxjs/operators';
import { RELATIVE_TIME_LIMIT } from '../../../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-user-permissions-editor',
  templateUrl: './user-permissions-editor.component.html',
  styleUrls: [ './user-permissions-editor.component.less' ],
})
export class UserPermissionsEditorComponent implements OnInit {

  @Input() formData: UserVO;

  queryParam = {
    businessType: '',
    env: [],
  };

  userPermissions: UserPermissionBusinessVO[];

  table = {
    columns: [],
    data: [],
    loading: false,
    show: false,
  };
  userBusinessPermission: PermissionBusinessVO;
  businessTypeOptions = [ BusinessTypeEnum.APPLICATION ];

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
    private envService: EnvService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }


  ngOnInit(): void {
    this.queryParam.businessType = this.businessTypeOptions[0];
    this.onGetRoleColumns();
    this.onUserPermission();
  }

  onGetRoleColumns() {
    const param: EnvPageQuery = {
      queryName: '', page: 1, length: 10,
    };
    this.envService.queryEnvPage(param)
      .subscribe(({ body }) => {
        body.data.map(env => {
          this.table.columns.push(env.envName);
          this.table.show = true;
        });
      });
  }

  changeChecked(userPermission: UserPermissionVO) {
    if (userPermission.id !== null) {
      const dialogDate = {
        ...this.dialogDate.warningOperateData,
        content: this.dialogDate.content.revoke,
      };
      this.dialogUtil.onDialog(dialogDate, () => {
        const param: RevokeUserPermission = {
          username: this.formData.username,
          businessType: userPermission.businessType,
          businessId: userPermission.businessId,
          role: userPermission.role,
        };
        this.userPermissionService.revokeUserPermission(param)
          .subscribe(() => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
            this.onUserPermission();
          });
      });
    } else {
      const dialogDate = {
        ...this.dialogDate.warningOperateData,
        content: this.dialogDate.content.grant,
      };
      this.dialogUtil.onDialog(dialogDate, () => {
        const param: GrantUserPermission = {
          username: this.formData.username,
          businessType: userPermission.businessType,
          businessId: userPermission.businessId,
          role: userPermission.role,
        };
        this.userPermissionService.grantUserPermission(param)
          .subscribe(() => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
            this.onUserPermission();
          });
      });
    }
  };

  onUserPermission() {
    this.table.loading = true;
    this.table.data = [];
    const param: QueryAllBusinessUserPermissionDetails = {
      businessType: this.queryParam.businessType,
      username: this.formData.username,
    };
    this.userPermissionService.queryAllBusinessUserPermissionDetails(param)
      .pipe(
        finalize(() => this.table.loading = false),
      )
      .subscribe(({ body }) => {
        this.userPermissions = body.userPermissions;
        this.userPermissions.map(item => {
          let row = {
            name: item.name,
            businessType: item.businessType,
            businessId: item.businessId,
            $halfCheck: true,
            $allCheck: true,
          };
          item.userPermissions.map(userPermission => {
            row[userPermission.role] = {
              checked: userPermission.valid,
              expiredTime: userPermission.expiredTime,
            };
            if (!userPermission.valid) {
              row['$allCheck'] = false;
            }
          });
          if (row['$allCheck']) {
            row['$halfCheck'] = false;
          }
          this.table.data.push(row);
        });
      });
  }

  onSearchUserBusinessPermission = (term: string) => {
    const param: UserPermissionBusinessPageQuery = {
      ...this.queryParam, length: 10, page: 1, queryName: term,
    };
    return this.userPermissionService.queryUserBusinessPermissionPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((permission, index) => ({ id: index, option: permission })),
        ),
      );
  };

  onBusinessTypeChange(businessType: string) {
    this.onUserPermission();
  }

  onSave() {
    console.log(this.table.data);
  }

  onCellEditEnd(event) {
    event.rowItem['$allCheck'] = true;
    event.rowItem['$halfCheck'] = false;
    this.table.columns.map(item => {
      if (event.rowItem[item]['checked']) {
        event.rowItem['$halfCheck'] = true;
      }
      if (!event.rowItem[item]['checked']) {
        event.rowItem['$allCheck'] = false;
      }
    });
    if (event.rowItem['$allCheck']) {
      event.rowItem['$halfCheck'] = false;
    }
  }

  onRowNew() {
    if (this.userBusinessPermission) {
      let data = {
        name: this.userBusinessPermission.name,
        businessType: this.userBusinessPermission.businessType,
        businessId: this.userBusinessPermission.businessId,
        $halfCheck: false,
        $allCheck: false,
      };
      this.table.columns.map(item => {
        data[item] = {
          checked: false,
          expiredTime: null
        };
      });
      this.table.data.push(data);
    }
  }

  onHalfCheckboxChange(rowItem) {
    if (rowItem['$halfCheck'] && rowItem['$allCheck']) {
      rowItem['$halfCheck'] = false;
      rowItem['$allCheck'] = false;
      this.table.columns.map(item => {
        rowItem[item]['checked'] = false;
      });
      return;
    }
    if (rowItem['$halfCheck'] && !rowItem['$allCheck']) {
      rowItem['$halfCheck'] = false;
      rowItem['$allCheck'] = true;
      this.table.columns.map(item => {
        rowItem[item]['checked'] = true;
      });
      return;
    }
    if (!rowItem['$halfCheck'] && !rowItem['$allCheck']) {
      rowItem['$halfCheck'] = false;
      rowItem['$allCheck'] = true;
      this.table.columns.map(item => {
        rowItem[item]['checked'] = true;
      });
      return;
    }
    if (!rowItem['$halfCheck'] && rowItem['$allCheck']) {
      rowItem['$halfCheck'] = false;
      rowItem['$allCheck'] = false;
      this.table.columns.map(item => {
        rowItem[item]['checked'] = false;
      });
      return;
    }
  }

  protected readonly limit = RELATIVE_TIME_LIMIT;
}

