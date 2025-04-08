import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import {
  UpdateWorkOrder,
  UpdateWorkOrderGroup,
  WorkOrderGroupVO,
  WorkOrderVO,
} from '../../../../../@core/data/work-order';
import { DValidateRules } from 'ng-devui';
import { WorkOrderService } from '../../../../../@core/services/work-order.service';

@Component({
  selector: 'app-work-order-management-editor',
  templateUrl: './work-order-management-editor.component.html',
  styleUrls: ['./work-order-management-editor.component.less']
})
export class WorkOrderManagementEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: WorkOrderVO;

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
    const param: UpdateWorkOrder = {
      ...this.formData,
    };
    return this.workOrderService.updateWorkOrder(param);
  }

  onI18nChange(content: string, workOrder: WorkOrderVO) {
    workOrder.i18n = content;
  }

  onWorkflowChange(content: string, workOrder: WorkOrderVO) {
    workOrder.workflow = content;
  }

}
