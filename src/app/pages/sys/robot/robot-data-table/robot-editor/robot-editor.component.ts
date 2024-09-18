import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { map } from 'rxjs/operators';
import { RobotEdit, RobotTokenVO } from '../../../../../@core/data/robot';
import { UserPageQuery, UserVO } from '../../../../../@core/data/user';
import { UserService } from '../../../../../@core/services/user.service';
import { RobotService } from '../../../../../@core/services/robot.service';

@Component({
  selector: 'app-robot-editor',
  templateUrl: './robot-editor.component.html',
  styleUrls: [ './robot-editor.component.less' ],
})
export class RobotEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: RobotEdit;
  user: UserVO;
  minDate: Date = new Date();
  robotToken: RobotTokenVO = null;

  robotTokenExample: string = `
  ### Robot calls API
\`\`\`bash
$ curl -X 'GET' \\
'http://127.0.0.1:8081/api/user/username/get?username=baiyi' \\
-H 'content-type: application/json' -H "Authorization: Robot {ROBOT_TOKEN}"
\`\`\`
  `;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private robotService: RobotService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  submitForm({ valid, directive }) {
    if (valid) {
      this.robotToken = null;
      const param: RobotEdit = {
        ...this.formData,
        expiredTime: Date.parse(this.formData.expiredTime.toString()),
      };
      this.robotService.addRobot(param)
        .subscribe(({ body }) => {
          this.robotToken = body;
        });
    } else {
      console.log(directive);
    }
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

  onUserChange(user: UserVO) {
    this.formData.username = user.username;
  }
}
