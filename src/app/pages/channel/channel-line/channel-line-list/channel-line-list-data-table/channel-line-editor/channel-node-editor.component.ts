import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { ChannelNodeEdit, ChannelNodeVO } from '../../../../../../@core/data/channel-line';
import { ChannelNodeService } from '../../../../../../@core/services/channel-line.service';
import { ChannelInfoService } from '../../../../../../@core/services/channel-info.service';

@Component({
  selector: 'app-channel-line-editor',
  templateUrl: './channel-node-editor.component.html',
  styleUrls: ['./channel-node-editor.component.less'],
})
export class ChannelNodeEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: ChannelNodeVO;

  channelOptions: { label: string; value: number }[] = [];
  selectedChannel: any = null;
  nodeTypeOptions = ['LEASED_LINE', 'IPSEC_VPN', 'INTERNET', 'CLOUD', 'IDC'];
  editorTab = 'basic';
  styleOptions = ['', 'ALIYUN', 'AWS', 'HWC'];
  styleIconMap: { [key: string]: string } = {
    '': 'assets/common-icon/data-center.svg',
    'ALIYUN': 'assets/eds/aliyun.svg',
    'AWS': 'assets/eds/aws.svg',
    'HWC': 'assets/eds/huaweicloud.svg',
  };

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: { validators: [{ required: true }], message: 'name can not be null.' },
  };

  constructor(
    private channelNodeService: ChannelNodeService,
    private channelInfoService: ChannelInfoService,
  ) {}

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.fetchChannels();
  }

  fetchChannels() {
    this.channelInfoService.queryChannelPage({ queryName: '', page: 1, length: 50 })
      .subscribe(({ body }) => {
        this.channelOptions = (body.data || []).map(c => ({ label: c.name, value: c.id }));
        if (this.formData.channelId) {
          this.selectedChannel = this.channelOptions.find(c => c.value === this.formData.channelId) || null;
        }
      });
  }

  onChannelChange(selected: any) {
    this.formData.channelId = selected?.value || null;
  }

  private trimFields(param: ChannelNodeEdit) {
    param.name = param.name?.trim();
    param.sourceEndpoint = param.sourceEndpoint?.trim();
    param.monitorUrl = param.monitorUrl?.trim();
    return param;
  }

  addForm() {
    const param = this.trimFields({ ...this.formData });
    return this.channelNodeService.addChannelNode(param);
  }

  updateForm() {
    const param = this.trimFields({ ...this.formData });
    return this.channelNodeService.updateChannelNode(param);
  }
}
