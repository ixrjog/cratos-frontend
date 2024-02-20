import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import {
  CredentialAdd,
  CredentialTypeEnum,
  CredentialUpdate,
  CredentialVO,
} from '../../../../../@core/data/credential';
import { CredentialService } from '../../../../../@core/services/credential.service';

@Component({
  selector: 'app-credential-editor',
  templateUrl: './credential-editor.component.html',
  styleUrls: ['./credential-editor.component.less']
})
export class CredentialEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input()
  data: any;
  formData: CredentialVO;
  operationType: boolean;
  credentialTypeOptions = [];
  minDate: Date = new Date();

  credentialData = {
    showPassphrase: false,
    credential: '',
    credential2: '',
  };

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    title: {
      validators: [ { required: true } ],
      message: 'title can not be null.',
      // asyncValidators: [{ sameName: this.checkName.bind(this), message: {
      //     'zh-cn': '用户名重名',
      //     'en-us': 'Duplicate name.'
      //   }
      // }],
    },
    username: { validators: [ { required: true } ] },
    credential: { validators: [ { required: true } ] },
  };

  constructor(private credentialService: CredentialService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.operationType = this.data['operationType'];
    this.warpCredentialData(this.formData.credentialType);
    this.getCredentialOptions();
  }

  onCredentialTypeChange(credentialType: any) {
    this.warpCredentialData(credentialType.value);
  }

  warpCredentialData(credentialType: string) {
    switch (credentialType) {
      case CredentialTypeEnum.USERNAME_WITH_PASSWORD:
        this.credentialData = {
          showPassphrase: false,
          credential: 'Password',
          credential2: '',
        };
        break;
      case CredentialTypeEnum.SSH_USERNAME_WITH_PRIVATE_KEY:
        this.credentialData = {
          showPassphrase: true,
          credential: 'Private Key',
          credential2: '',
        };
        break;
      case CredentialTypeEnum.SSH_USERNAME_WITH_KEY_PAIR:
        this.credentialData = {
          showPassphrase: true,
          credential: 'Private Key',
          credential2: 'Public Key',
        };
        break;
      case CredentialTypeEnum.TOKEN:
        this.credentialData = {
          showPassphrase: false,
          credential: 'Token',
          credential2: '',
        };
        break;
      case CredentialTypeEnum.ACCESS_KEY:
        this.credentialData = {
          showPassphrase: false,
          credential: 'AccessKey ID',
          credential2: 'AccessKey Secret',
        };
        break;
      case CredentialTypeEnum.KUBE_CONFIG:
        this.credentialData = {
          showPassphrase: false,
          credential: 'KubeConfig',
          credential2: '',
        };
        break;
      case CredentialTypeEnum.SSL_CERTIFICATES:
        this.credentialData = {
          showPassphrase: true,
          credential: 'Certificate File',
          credential2: 'Certificate Key',
        };
        break;
      default:
        this.credentialData = {
          showPassphrase: false,
          credential: '',
          credential2: '',
        };
        break;
    }
  }

  getCredentialOptions() {
    this.credentialService.getCredentialOptions()
      .subscribe(({ body }) => {
        this.credentialTypeOptions = body.options;
      });
  };

  addForm() {
    const param: CredentialAdd = {
      ...this.formData,
      expiredTime: Date.parse(this.formData.expiredTime.toString()),
    };
    return this.credentialService.addCredential(param);
  }

  updateForm() {
    const param: CredentialUpdate = {
      id: this.formData.id,
      title: this.formData.title,
      username: this.formData.username,
      comment: this.formData.comment,
      valid: this.formData.valid,
    };
    return this.credentialService.updateCredential(param);
  }

  protected readonly JSON = JSON;
}
