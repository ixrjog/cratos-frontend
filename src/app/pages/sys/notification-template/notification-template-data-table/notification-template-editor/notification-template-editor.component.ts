import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { NotificationTemplateEdit, NotificationTemplateVO } from '../../../../../@core/data/notification-template';
import { NotificationTemplateService } from '../../../../../@core/services/notification-template.service';

@Component({
  selector: 'app-notification-template-editor',
  templateUrl: './notification-template-editor.component.html',
  styleUrls: [ './notification-template-editor.component.less' ],
})
export class NotificationTemplateEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: NotificationTemplateVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    content: {
      validators: [ { required: true } ],
      message: 'content can not be null.',
    },
  };

  constructor(private notificationTemplateService: NotificationTemplateService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  updateForm() {
    const param: NotificationTemplateEdit = {
      ...this.formData,
    };
    return this.notificationTemplateService.updateNotificationTemplate(param);
  }

  addForm() {
    const param: NotificationTemplateEdit = {
      ...this.formData,
    };
    return this.notificationTemplateService.addNotificationTemplate(param);
  }

  onContentChange(content: string, notificationTemplateVO: NotificationTemplateVO) {
    notificationTemplateVO.content = content;
  }

}
