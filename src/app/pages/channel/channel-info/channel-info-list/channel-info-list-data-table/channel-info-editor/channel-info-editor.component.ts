import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import {
  ChannelAvailableStatusEnum,
  ChannelConstructionPhaseEnum,
  ChannelInfoEdit,
  ChannelInfoVO,
  ChannelPriorityEnum,
} from '../../../../../../@core/data/channel-info';
import { ChannelInfoService } from '../../../../../../@core/services/channel-info.service';

@Component({
  selector: 'app-channel-info-editor',
  templateUrl: './channel-info-editor.component.html',
  styleUrls: ['./channel-info-editor.component.less'],
})
export class ChannelInfoEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: ChannelInfoVO;

  countryOptions = ['CN', 'NG', 'TZ', 'BD', 'PK', 'GH', 'UG', 'PH', 'ZA', 'KE', 'BF', 'IQ'];

  availableStatusOptions = [
    ChannelAvailableStatusEnum.HA,
    ChannelAvailableStatusEnum.UNSTABLE,
    ChannelAvailableStatusEnum.DOWN,
  ];

  priorityOptions = [
    ChannelPriorityEnum.HIGH,
    ChannelPriorityEnum.MEDIUM,
    ChannelPriorityEnum.LOW,
    ChannelPriorityEnum.PENDING,
  ];

  constructionPhaseOptions = [
    ChannelConstructionPhaseEnum.PLANNING,
    ChannelConstructionPhaseEnum.BUILDING,
    ChannelConstructionPhaseEnum.TESTING,
    ChannelConstructionPhaseEnum.COMPLETED,
  ];

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [{ required: true }],
      message: 'name can not be null.',
    },
  };

  constructor(private channelInfoService: ChannelInfoService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: ChannelInfoEdit = { ...this.formData };
    return this.channelInfoService.addChannel(param);
  }

  updateForm() {
    const param: ChannelInfoEdit = { ...this.formData };
    return this.channelInfoService.updateChannel(param);
  }
}
