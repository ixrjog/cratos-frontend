import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { UserEdit, UserVO } from '../../../../../../@core/data/user';
import { UserService } from '../../../../../../@core/services/user.service';

@Component({
  selector: 'app-user-info-editor',
  templateUrl: './user-info-editor.component.html',
  styleUrls: [ './user-info-editor.component.less' ],
})
export class UserInfoEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() formData: UserVO;
  @Input() operationType: boolean;
  @Input() fromAssetId: number;
  @Output() onUserAdded = new EventEmitter<UserVO>();

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    username: {
      validators: [ { required: true } ],
      message: 'username can not be null.',
    },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
    displayName: {
      validators: [ { required: true } ],
      message: 'displayName can not be null.',
    },
  };

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
  }

  submitForm({ valid, directive }) {
    if (valid) {
      const param: UserEdit = {
        ...this.formData,
        fromAssetId: this.fromAssetId,
      };
      if (this.operationType) {
        this.userService.addUser(param).subscribe(() => this.getUser());
      } else {
        this.userService.updateUser(param).subscribe(() => this.getUser());
      }
    } else {
      console.log(directive);
    }
  }

  getUser() {
    this.userService.getUserByUsername({ username: this.formData.username })
      .subscribe(({ body }) => {
        this.onUserAdded.emit(body);
      });
  }


}
