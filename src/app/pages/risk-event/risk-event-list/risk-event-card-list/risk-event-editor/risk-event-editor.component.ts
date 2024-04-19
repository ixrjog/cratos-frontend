import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { RiskEventEdit, RiskEventVO } from '../../../../../@core/data/risk-event';
import { RiskEventService } from '../../../../../@core/services/risk-event.service';

@Component({
  selector: 'app-risk-event-editor',
  templateUrl: './risk-event-editor.component.html',
  styleUrls: [ './risk-event-editor.component.less' ],
})
export class RiskEventEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: RiskEventVO;


  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private riskEventService: RiskEventService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: RiskEventEdit = {
      ...this.formData,
      eventTime: this.formData.eventTime.getTime(),
    };
    return this.riskEventService.addRiskEvent(param);
  }

  updateForm() {
    const param: RiskEventEdit = {
      ...this.formData,
      eventTime: this.formData.eventTime.getTime(),
    };
    return this.riskEventService.updateRiskEvent(param);
  }

  protected readonly JSON = JSON;
}
