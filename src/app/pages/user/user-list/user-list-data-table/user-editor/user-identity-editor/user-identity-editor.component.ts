import { Component, Input } from '@angular/core';
import { UserVO } from '../../../../../../@core/data/user';
import { EdsIdentityService } from '../../../../../../@core/services/ext-dataSource-identity.service';
import { DIALOG_DATA, DialogUtil } from '../../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';
import {
  AssetPageQuery,
  EdsAssetVO,
  EdsInstanceVO,
  InstancePageQuery,
} from '../../../../../../@core/data/ext-datasource';
import { map } from 'rxjs/operators';
import { finalize } from 'rxjs';
import { FormLayout } from 'ng-devui/form';
import {
  AddLdapUserToTheGroup,
  CreateLdapIdentity,
  DeleteLdapIdentity,
  RemoveLdapUserFromGroup,
  ResetLdapUserPassword,
} from '../../../../../../@core/data/ext-dataSource-identity';

@Component({
  selector: 'app-user-identity-editor',
  templateUrl: './user-identity-editor.component.html',
  styleUrls: [ './user-identity-editor.component.less' ],
})
export class UserIdentityEditorComponent {

  @Input() formData: UserVO;
  edsTypeOptions = [ 'LDAP' ];
  edsType = 'LDAP';
  edsInstance: EdsInstanceVO = null;
  loading: boolean = false;
  UserIdentityDetail = {};
  canCreate: boolean = false;
  showButton: boolean = false;
  memberName = 'Group';
  showIdentityInfo: boolean = false;
  edsAsset: EdsAssetVO;
  identityInfo = {
    username: '',
    password: '',
  };

  table = {
    loading: false,
    data: [],
  };

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(
    private edsService: EdsService,
    private edsIdentityService: EdsIdentityService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil) {
  }

  fetchData() {
    if (this.edsType === 'LDAP') {
      this.onGetLdapIdentity();
    }
  }

  onSearchEdsInstance = (term: string) => {
    const param: InstancePageQuery = {
      length: 10, page: 1, queryName: term, edsType: this.edsType,
    };
    return this.edsService.queryEdsInstancePage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((instance, index) => ({ id: index, option: instance })),
        ),
      );
  };

  onSearchEdsInstanceMember = (term: string) => {
    let param: AssetPageQuery;
    if (this.edsType === 'LDAP') {
      param = {
        length: 10, page: 1, queryName: term, assetType: 'LDAP_GROUP', valid: null, instanceId: this.edsInstance.id,
      };
    }
    return this.edsService.queryEdsInstanceAssetPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((asset, index) => ({ id: index, option: asset })),
        ),
      );
  };

  onEdsTypeChange(edsType: string) {
    this.edsType = edsType;
    this.fetchData();
    this.showButton = false;
    this.edsInstance = null;
  }

  onEdsInstanceChange(instance: EdsInstanceVO) {
    this.showButton = true;
    this.canCreate = false;
    if (this.UserIdentityDetail['instanceMap'] && !this.UserIdentityDetail['instanceMap'][instance.id]) {
      this.canCreate = true;
    }
    this.onGetInstanceMember();
  }

  onGetInstanceMember() {
    if (!this.edsInstance) {
      return;
    }
    this.table.data = [];
    if (this.edsType === 'LDAP') {
      const asset = this.UserIdentityDetail['ldapIdentities'][this.edsInstance.id];
      this.UserIdentityDetail['ldapGroupMap'][asset.id]
        .forEach(item => {
          const obj = {
            name: item,
            comment: '',
          };
          this.table.data.push(obj);
        });
    }
  }

  onGetLdapIdentity() {
    this.edsIdentityService.queryLdapIdentityDetails({ username: this.formData.username })
      .pipe(
        finalize(() => this.loading = false),
      )
      .subscribe(({ body }) => {
        this.UserIdentityDetail = body;
        this.onGetInstanceMember();
      });
  }

  onCreateIdentity() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.create,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      if (this.edsType === 'LDAP') {
        const param: CreateLdapIdentity = {
          instanceId: this.edsInstance.id,
          username: this.formData.username,
        };
        this.edsIdentityService.createLdapIdentity(param)
          .subscribe(({ body }) => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.CREATE);
            this.identityInfo.username = body.username;
            this.identityInfo.password = body.password;
            this.showIdentityInfo = true;
            this.canCreate = false;
          });
      }
    });
  }

  onResetIdentity() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.reset,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      if (this.edsType === 'LDAP') {
        const param: ResetLdapUserPassword = {
          instanceId: this.edsInstance.id,
          username: this.formData.username,
        };
        this.edsIdentityService.resetLdapUserPassword(param)
          .subscribe(({ body }) => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
            this.identityInfo.username = body.username;
            this.identityInfo.password = body.password;
            this.showIdentityInfo = true;
          });
      }
    });
  }

  onDeleteIdentity() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      if (this.edsType === 'LDAP') {
        const param: DeleteLdapIdentity = {
          instanceId: this.edsInstance.id,
          username: this.formData.username,
        };
        this.edsIdentityService.deleteLdapIdentity(param)
          .subscribe(({ body }) => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
            this.canCreate = true;
          });
      }
    });
  }

  onAddMember() {
    if (this.edsType === 'LDAP') {
      const param: AddLdapUserToTheGroup = {
        instanceId: this.edsInstance.id,
        username: this.formData.username,
        group: this.edsAsset.assetKey,
      };
      this.edsIdentityService.addLdapUserToTheGroup(param)
        .subscribe(({ body }) => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
          this.fetchData();
        });
    }
  }

  onRowRemove(rowItem) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      if (this.edsType === 'LDAP') {
        const param: RemoveLdapUserFromGroup = {
          instanceId: this.edsInstance.id,
          username: this.formData.username,
          group: rowItem.name,
        };
        this.edsIdentityService.removeLdapUserFromGroup(param)
          .subscribe(({ body }) => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
            this.fetchData();
          });
      }
    });
  }

  protected readonly FormLayout = FormLayout;
  protected readonly JSON = JSON;
}
