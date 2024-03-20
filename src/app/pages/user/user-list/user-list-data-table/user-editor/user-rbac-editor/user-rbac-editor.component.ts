import { Component, Input, OnInit } from '@angular/core';
import { UserVO } from '../../../../../../@core/data/user';
import { RbacService } from '../../../../../../@core/services/rbac.service';
import { RolePageQuery } from '../../../../../../@core/data/rbac';
import { Observable, zip } from 'rxjs';
import { HttpResult } from '../../../../../../@core/data/base-data';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-user-rbac-editor',
  templateUrl: './user-rbac-editor.component.html',
  styleUrls: [ './user-rbac-editor.component.less' ],
})
export class UserRbacEditorComponent implements OnInit {

  @Input() formData: UserVO;

  sourceOption = [];
  targetOption = [];

  constructor(private rbacService: RbacService,
              private toastUtil: ToastUtil) {
  }

  initOption() {
    this.sourceOption = [];
    this.targetOption = [];
    const param: RolePageQuery = {
      roleName: '',
      page: 1,
      length: 20,
    };
    this.rbacService.queryRolePage(param)
      .subscribe(({ body }) => {
        if (JSON.stringify(this.formData.rbacRoles) === '[]') {
          this.sourceOption = body.data
            .map(rbac => ({ id: rbac.id, name: rbac.roleName }));
        } else {
          this.targetOption = this.formData.rbacRoles
            .map(rbac => ({ id: rbac.id, name: rbac.roleName }));
          this.sourceOption = body.data
            .map(rbac => ({ id: rbac.id, name: rbac.roleName }))
            .filter(rbac => {
              let flag = true;
              this.targetOption.forEach(target => {
                if (rbac.id === target.id) {
                  flag = false;
                }
              });
              return flag;
            });
        }
      });
  }

  ngOnInit(): void {
    this.initOption();
  }


  transferToTarget(data: any) {
    let obList: Observable<HttpResult<Boolean>>[] = [];
    data['changeData'].map(row => {
      obList.push(this.rbacService.addUserRole({ username: this.formData.username, roleId: row.id }));
    });
    zip(obList).subscribe(() => {
      this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
    });
  }

  transferToSource(data: any) {
    let obList: Observable<HttpResult<Boolean>>[] = [];
    data['changeData'].map(row => {
      obList.push(this.rbacService.deleteUserRole({ username: this.formData.username, roleId: row.id }));
    });
    zip(obList).subscribe(() => {
      this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
    });
  }

}
