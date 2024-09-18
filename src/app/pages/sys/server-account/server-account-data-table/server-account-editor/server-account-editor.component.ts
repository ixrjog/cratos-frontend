import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { CredentialPageQuery, CredentialVO } from '../../../../../@core/data/credential';
import { map } from 'rxjs/operators';
import { CredentialService } from '../../../../../@core/services/credential.service';
import { ServerAccountService } from '../../../../../@core/services/server-account.service';
import {
  RemoteManagementProtocolEnum,
  ServerAccountEdit,
  ServerAccountVO,
} from '../../../../../@core/data/server-account';

@Component({
  selector: 'app-server-account-editor',
  templateUrl: './server-account-editor.component.html',
  styleUrls: [ './server-account-editor.component.less' ],
})
export class ServerAccountEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: ServerAccountVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    }
  };

  protocolOptions = [
    RemoteManagementProtocolEnum.SSH, RemoteManagementProtocolEnum.RDP, RemoteManagementProtocolEnum.VNC,
  ];

  constructor(private serverAccountService: ServerAccountService,
              private credentialService: CredentialService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: ServerAccountEdit = {
      ...this.formData,
    };
    return this.serverAccountService.addServerAccount(param);
  }

  updateForm() {
    const param: ServerAccountEdit = {
      ...this.formData,
    };
    return this.serverAccountService.updateServerAccount(param);
  }

  onSearchCredential = (term: string) => {
    const param: CredentialPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.credentialService.queryCredentialPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((credential, index) => ({ id: index, option: credential })),
        ),
      );
  };

  onCredentialChange(credential: CredentialVO) {
    this.formData.credentialId = credential.id;
  }
}
