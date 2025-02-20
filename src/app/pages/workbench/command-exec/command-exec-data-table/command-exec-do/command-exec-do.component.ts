import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { CommandExecVO, DoCommandExec } from '../../../../../@core/data/command';
import { DIALOG_DATA, DialogUtil } from '../../../../../@shared/utils/dialog.util';
import { DValidateRules } from 'ng-devui';
import { CommandService } from '../../../../../@core/services/command.service';
import { ToastUtil } from '../../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-command-exec-do',
  templateUrl: './command-exec-do.component.html',
  styleUrls: [ './command-exec-do.component.less' ],
})
export class CommandExecDoComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: CommandExecVO;
  maxWaitingTime: number = 10;
  min: number = 10;
  max: number = 60;

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
  };

  constructor(private commandService: CommandService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  updateForm() {
    const param: DoCommandExec = {
      commandExecId: this.formData.id,
      maxWaitingTime: this.maxWaitingTime,
    };
    return this.commandService.doCommandExec(param);
  }

}
