import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { getRowColor } from 'src/app/@shared/utils/data-table.utli';
import { RobotEdit, RobotTokenVO, RobotVO } from '../../../../@core/data/robot';
import { RobotService } from '../../../../@core/services/robot.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';

@Component({
  selector: 'app-user-robot-settings',
  templateUrl: './user-robot-settings.component.html',
  styleUrls: [ './user-robot-settings.component.less' ],
})
export class UserRobotSettingsComponent implements OnInit {

  robotTokenList: RobotVO[];

  constructor(
    private robotService: RobotService,
    private dialogUtil: DialogUtil,
    private toastUtil: ToastUtil,
  ) {
  }

  @Input() username: string;
  verticalLayout: FormLayout = FormLayout.Vertical;
  formData: RobotEdit = {
    expiredTime: null,
    name: '',
    valid: true,
    trail: true,
    comment: '',
  };
  robotToken: RobotTokenVO = null;
  minDate: Date = new Date();
  protected readonly limit = RELATIVE_TIME_LIMIT;
  robotTokenExample: string = `
  ### Robot calls API
\`\`\`bash
$ curl -X 'GET' \\
'http://127.0.0.1:8081/api/user/username/get?username=baiyi' \\
-H 'content-type: application/json' -H "Authorization: Robot {ROBOT_TOKEN}"
\`\`\`
  `;

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.robotService.queryRobotByUsername({ username: this.username })
      .subscribe(({ body }) => this.robotTokenList = body);
  }

  submitForm({ valid, directive }) {
    if (valid) {
      this.robotToken = null;
      const param: RobotEdit = {
        ...this.formData,
        expiredTime: Date.parse(this.formData.expiredTime.toString()),
      };
      this.robotService.applyRobot(param)
        .subscribe(({ body }) => {
          this.robotToken = body;
          this.fetchData();
        });
    } else {
      console.log(directive);
    }
  }

  onRowRevoke(rowItem: RobotVO) {
    if (rowItem.valid) {
      const dialogDate = {
        ...this.dialogDate.warningOperateData,
        content: this.dialogDate.content.revoke,
      };
      this.dialogUtil.onDialog(dialogDate, () => {
        this.robotService.revokeRobot({ id: rowItem.id })
          .subscribe(() => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.REVOKE);
            this.fetchData();
          });
      });
    }
  }

  protected readonly getRowColor = getRowColor;

}
