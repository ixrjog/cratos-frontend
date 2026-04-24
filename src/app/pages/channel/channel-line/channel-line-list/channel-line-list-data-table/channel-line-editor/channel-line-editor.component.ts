import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { ChannelLineEdit, ChannelLineVO } from '../../../../../../@core/data/channel-line';
import { ChannelLineService } from '../../../../../../@core/services/channel-line.service';
import { ChannelInfoService } from '../../../../../../@core/services/channel-info.service';

@Component({
  selector: 'app-channel-line-editor',
  templateUrl: './channel-line-editor.component.html',
  styleUrls: ['./channel-line-editor.component.less'],
})
export class ChannelLineEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: ChannelLineVO;

  channelOptions: { label: string; value: number }[] = [];
  selectedChannel: any = null;
  lineTypeOptions = ['LEASED_LINE', 'IPSEC_VPN', 'INTERNET', 'CLOUD', 'IDC'];

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: { validators: [{ required: true }], message: 'name can not be null.' },
  };

  constructor(
    private channelLineService: ChannelLineService,
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

  addForm() {
    const param: ChannelLineEdit = { ...this.formData };
    return this.channelLineService.addChannelLine(param);
  }

  updateForm() {
    const param: ChannelLineEdit = { ...this.formData };
    return this.channelLineService.updateChannelLine(param);
  }
}
