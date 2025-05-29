import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { AddCommandExec, CommandExecVO } from '../../../../../@core/data/command';
import { CommandService } from '../../../../../@core/services/command.service';
import { UserService } from '../../../../../@core/services/user.service';
import { UserPageQuery, UserVO } from '../../../../../@core/data/user';
import { map } from 'rxjs/operators';
import { EdsInstanceVO } from '../../../../../@core/data/ext-datasource';

@Component({
  selector: 'app-command-exec-editor',
  templateUrl: './command-exec-editor.component.html',
  styleUrls: [ './command-exec-editor.component.less' ],
})
export class CommandExecEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: CommandExecVO;
  approveUser: UserVO;
  ccUser: UserVO;
  execTarget: { instanceId: number, namespace: string } = { instanceId: null, namespace: '' };
  maxWaitingTime: number = 10;
  min: number = 10;
  max: number = 60;
  namespaceOptions: string[] = [];
  instance: EdsInstanceVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
  };

  constructor(private commandService: CommandService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: AddCommandExec = {
      ...this.formData,
      execTarget: this.execTarget,
    };
    if (this.formData.autoExec) {
      param.execTarget['maxWaitingTime'] = this.maxWaitingTime;
    }
    return this.commandService.addCommandExec(param);
  }

  onCommandChange(command: string, commandExec: CommandExecVO) {
    commandExec.command = command;
  }

  onSearchUser = (term: string) => {
    const param: UserPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.userService.queryUserPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((user, index) => ({ id: index, option: user })),
        ),
      );
  };

  onSearchCommandExecUser = (term: string) => {
    const param: UserPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.commandService.queryCommandExecUserPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((user, index) => ({ id: index, option: user })),
        ),
      );
  };

  onSearchInstance = (term: string) => {
    const param = {
      length: 10, page: 1, queryName: term,
    };
    return this.commandService.queryCommandExecEdsInstancePage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((instance, index) => ({ id: index, option: instance })),
        ),
      );
  };

  onGetNamespace(instanceId: number) {
    this.commandService.queryCommandExecEdsInstanceNamespace({ instanceId: instanceId })
      .subscribe(({ body }) => {
        this.namespaceOptions = body;
      });
  }

  onCCUserChange(user: UserVO) {
    this.formData.ccTo = user.username;
  }

  onApproveUserChange(user: UserVO) {
    this.formData.approvedBy = user.username;
  }

  onInstanceChange(instance: EdsInstanceVO) {
    this.execTarget.instanceId = instance.id;
    this.onGetNamespace(instance.id);
  }

}
