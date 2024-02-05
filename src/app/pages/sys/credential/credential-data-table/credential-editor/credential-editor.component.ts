import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { CredentialEdit, CredentialTypeEnum, CredentialVO } from '../../../../../@core/data/credential';
import { CredentialService } from '../../../../../@core/services/credential.service';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

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
  credentialFormGroup: FormGroup;
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
    credentialType: {
      validators: [ { required: true } ],
      message: 'Enter a value that contains 1 to 15 digits and letters.',
    },
    credential: { validators: [ { required: true } ] },
  };

  constructor(private credentialService: CredentialService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.operationType = this.data['operationType'];
    this.resetCredentialFormGroup();
    this.warpCredentialData(this.credentialFormGroup.get('credentialType').value);
    this.getCredentialOptions();
  }

  resetCredentialFormGroup() {
    this.credentialFormGroup = new UntypedFormGroup({
      id: new UntypedFormControl(this.formData.id ? this.formData.id : null),
      title: new UntypedFormControl(this.formData.title),
      credentialType: new UntypedFormControl(this.formData.credentialType),
      username: new UntypedFormControl(this.formData.username),
      fingerprint: new UntypedFormControl(this.formData.fingerprint),
      credential: new UntypedFormControl(this.formData.credential),
      credential2: new UntypedFormControl(this.formData.credential2),
      valid: new UntypedFormControl(this.formData.valid),
      passphrase: new UntypedFormControl(this.formData.passphrase),
      expiredTime: new UntypedFormControl(this.formData.expiredTime),
      comment: new UntypedFormControl(this.formData.comment),
      privateCredential: new UntypedFormControl(false),
    });
  }

  onCredentialTypeChange(credentialType: any) {
    this.warpCredentialData(credentialType.value);
  }

  warpCredentialData(credentialType: string) {
    this.resetCredentialFormGroup();
    switch (credentialType) {
      case CredentialTypeEnum.USERNAME_WITH_PASSWORD:
        this.credentialData = {
          showPassphrase: false,
          credential: '凭据(密码)',
          credential2: '',
        };
        break;
      case CredentialTypeEnum.SSH_USERNAME_WITH_PRIVATE_KEY:
        this.credentialData = {
          showPassphrase: true,
          credential: '凭据(私钥)',
          credential2: '',
        };
        break;
      case CredentialTypeEnum.SSH_USERNAME_WITH_KEY_PAIR:
        this.credentialData = {
          showPassphrase: true,
          credential: '凭据(私钥)',
          credential2: '公钥',
        };
        break;
      case CredentialTypeEnum.TOKEN:
        this.credentialData = {
          showPassphrase: false,
          credential: '凭据(令牌)',
          credential2: '',
        };
        break;
      case CredentialTypeEnum.ACCESS_KEY:
        this.credentialData = {
          showPassphrase: false,
          credential: 'AccessKey',
          credential2: 'SecretKey',
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
    return this.credentialService.getCredentialOptions()
      .subscribe(({ body }) => {
        this.credentialTypeOptions = body.options;
      });
  };

  addForm() {
    const param: CredentialEdit = {
      ...this.credentialFormGroup.value,
      expiredTime: Date.parse(this.credentialFormGroup.get('expiredTime').value),
    };
    return this.credentialService.addCredential(param);
  }

  updateForm() {

  }

  protected readonly JSON = JSON;
}
