import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserVO } from '../../../../../@core/data/user';
import { UserSshKeyEditorComponent } from './user-ssh-key-editor/user-ssh-key-editor.component';
import { UserIdentityEditorComponent } from './user-identity-editor/user-identity-editor.component';
import { UserRbacEditorComponent } from './user-rbac-editor/user-rbac-editor.component';
import { UserInfoEditorComponent } from './user-info-editor/user-info-editor.component';
import { UserPermissionsEditorComponent } from './user-permissions-editor/user-permissions-editor.component';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.less']
})
export class UserEditorComponent implements OnInit {

  @ViewChild('userInfo') private userInfo: UserInfoEditorComponent;
  @ViewChild('userPermissions') private userPermissions: UserPermissionsEditorComponent;
  @ViewChild('userRbac') private userRbac: UserRbacEditorComponent;
  @ViewChild('userSshKey') private userSshKey: UserSshKeyEditorComponent;
  @ViewChild('userIdentity') private userIdentity: UserIdentityEditorComponent;
  tabActiveId: string | number = 'info';
  @Input() data: any;
  formData: UserVO;
  operationType: boolean;
  fromAssetId: number;

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.operationType = this.data['operationType'];
    this.fromAssetId = this.data['fromAssetId'];
    if (this.data['tabActiveId']) {
      this.tabActiveId = this.data['tabActiveId'];
    }
  }

  onUserAdded(user: UserVO) {
    this.formData = user;
  }

  onActiveTabChange(tab) {
    switch (tab) {
      case 'sshkey':
        this.userSshKey.fetchData();
        break;
      case 'permissions':
        this.userPermissions.fetchData();
        break;
      case 'rbac':
        this.userRbac.fetchData();
        break;
      case 'identity':
        this.userIdentity.fetchData();
        break;
      default:
        break;
    }
  }

}
