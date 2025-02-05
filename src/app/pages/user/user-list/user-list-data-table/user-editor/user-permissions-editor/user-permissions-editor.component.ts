import { Component, Input, OnInit } from '@angular/core';
import { UserVO } from '../../../../../../@core/data/user';
import { DIALOG_DATA } from '../../../../../../@shared/utils/dialog.util';
import { UserPermissionService } from '../../../../../../@core/services/user-permission.service';
import { EnvService } from '../../../../../../@core/services/env.service';
import {
  PermissionBusinessVO,
  QueryAllBusinessUserPermissionDetails,
  UpdateUserPermissionBusiness,
  UserPermissionBusinessPageQuery,
  UserPermissionBusinessVO,
} from '../../../../../../@core/data/user-permission';
import { finalize } from 'rxjs';
import { EnvPageQuery } from '../../../../../../@core/data/env';
import { BusinessTypeEnum } from '../../../../../../@core/data/business';
import { map } from 'rxjs/operators';
import { RELATIVE_TIME_LIMIT } from '../../../../../../@shared/constant/date.constant';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-user-permissions-editor',
  templateUrl: './user-permissions-editor.component.html',
  styleUrls: [ './user-permissions-editor.component.less' ],
})
export class UserPermissionsEditorComponent implements OnInit {

  @Input() formData: UserVO;

  queryParam = {
    businessType: '',
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
            businessId: item.businessId,
            $halfCheck: true,
            $allCheck: true,
          };
          item.userPermissions.map(userPermission => {
            row[userPermission.role] = {
              checked: userPermission.id !== null,
              expiredTime: userPermission.expiredTime,
            };
            if (userPermission.id === null) {
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
    const param: UpdateUserPermissionBusiness = {
      username: this.formData.username,
      businessType: this.queryParam.businessType,
      businessPermissions: [],
    };
    this.table.data.map(item => {
      let roleMembers = [];
      this.table.columns.map(column => {
        let roleMember = {
          role: column,
          checked: item[column]['checked'] ? item[column]['checked'] : false,
          expiredTime: item[column]['expiredTime'] ? Date.parse(item[column]['expiredTime'].toString()) : null,
        };
        roleMembers.push(roleMember);
      });
      param.businessPermissions.push({
        businessId: item['businessId'],
        roleMembers: roleMembers,
      });
    });
    this.userPermissionService.updateUserPermissionBusiness(param)
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
        this.onUserPermission();
      });
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
      let flag = true;
      this.table.data.forEach(item => {
        if (item.name === this.userBusinessPermission.name) {
          flag = false;
        }
      });
      if (flag) {
        let data = {
          name: this.userBusinessPermission.name,
          businessId: this.userBusinessPermission.businessId,
          $halfCheck: false,
          $allCheck: false,
        };
        this.table.columns.map(item => {
          data[item] = {
            checked: false,
            expiredTime: null,
          };
        });
        this.table.data.push(data);
      }
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

