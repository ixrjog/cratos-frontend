import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { UserScriptEdit, UserScriptVO } from '../../../../@core/data/user-script';
import { UserScriptService } from '../../../../@core/services/user-script.service';

@Component({
  selector: 'app-user-script-editor',
  templateUrl: './user-script-editor.component.html',
  styleUrls: [ './user-script-editor.component.less' ],
})
export class UserScriptEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: UserScriptVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private userScriptService: UserScriptService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  onContentChange(content: string, userScriptVO: UserScriptVO) {
    userScriptVO.scriptContent = content;
  }

  addForm() {
    const param: UserScriptEdit = {
      ...this.formData,
    };
    return this.userScriptService.addUserScript(param);
  }

  updateForm() {
    const param: UserScriptEdit = {
      ...this.formData,
    };
    return this.userScriptService.updateUserScript(param);
  }

  protected readonly JSON = JSON;
}
