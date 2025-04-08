import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { UpdateWorkOrderGroup, WorkOrderGroupVO } from '../../../../../@core/data/work-order';
import { WorkOrderService } from '../../../../../@core/services/work-order.service';

@Component({
  selector: 'app-work-order-group-management-editor',
  templateUrl: './work-order-group-management-editor.component.html',
  styleUrls: [ './work-order-group-management-editor.component.less' ],
})
export class WorkOrderGroupManagementEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: WorkOrderGroupVO;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: { validators: [ { required: true } ] },
  };

  constructor(private workOrderService: WorkOrderService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  updateForm() {
    const param: UpdateWorkOrderGroup = {
      ...this.formData,
    };
    return this.workOrderService.updateWorkOrderGroup(param);
  }

  onI18nChange(content: string, workOrderGroup: WorkOrderGroupVO) {
    workOrderGroup.i18n = content;
  }

}
