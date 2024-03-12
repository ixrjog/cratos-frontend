import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import {
  ChannelAvailableStatusEnum,
  ChannelNetworkEdit,
  ChannelNetworkVO,
  ChannelStatusEnum,
} from '../../../../../@core/data/channel-network';
import { ChannelNetworkService } from '../../../../../@core/services/channel-network.service';

@Component({
  selector: 'app-channel-network-editor',
  templateUrl: './channel-network-editor.component.html',
  styleUrls: [ './channel-network-editor.component.less' ],
})
export class ChannelNetworkEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: ChannelNetworkVO;
  channelStatusOptions = [
    ChannelStatusEnum.DEBUG,
    ChannelStatusEnum.ONLINE,
  ];
  availableStatusOptions = [
    ChannelAvailableStatusEnum.HA,
    ChannelAvailableStatusEnum.UNSTABLE,
    ChannelAvailableStatusEnum.DOWN,

  ];

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
    channelKey: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private channelNetworkService: ChannelNetworkService) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
  }

  addForm() {
    const param: ChannelNetworkEdit = {
      ...this.formData,
    };
    return this.channelNetworkService.addChannelNetwork(param);
  }

  updateForm() {
    const param: ChannelNetworkEdit = {
      ...this.formData,
    };
    return this.channelNetworkService.updateChannelNetwork(param);
  }

  protected readonly JSON = JSON;
}
