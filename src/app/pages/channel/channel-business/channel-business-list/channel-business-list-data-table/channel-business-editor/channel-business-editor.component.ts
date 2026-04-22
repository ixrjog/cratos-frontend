import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { BusinessDirectionEnum, ChannelBusinessEdit, ChannelBusinessVO } from '../../../../../../@core/data/channel-business';
import { ChannelBusinessService } from '../../../../../../@core/services/channel-business.service';
import { OrganizationService } from '../../../../../../@core/services/organization.service';
import { ChannelInfoService } from '../../../../../../@core/services/channel-info.service';

@Component({
  selector: 'app-channel-business-editor',
  templateUrl: './channel-business-editor.component.html',
  styleUrls: ['./channel-business-editor.component.less'],
})
export class ChannelBusinessEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: ChannelBusinessVO;

  directionOptions = [
    BusinessDirectionEnum.OUTBOUND,
    BusinessDirectionEnum.INBOUND,
  ];

  typeOptions: string[] = [];

  orgOptions: { label: string; value: number }[] = [];
  orgQueryName = '';
  selectedOrg: any = null;

  channelOptions: { label: string; value: number }[] = [];
  channelQueryName = '';
  selectedChannel: any = null;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    businessName: {
      validators: [{ required: true }],
      message: 'business name can not be null.',
    },
  };

  constructor(
    private channelBusinessService: ChannelBusinessService,
    private organizationService: OrganizationService,
    private channelInfoService: ChannelInfoService,
  ) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.fetchTypeOptions();
    this.fetchOrgs();
    this.fetchChannels();
  }

  fetchTypeOptions() {
    this.channelBusinessService.getBusinessTypeOptions()
      .subscribe(({ body }) => {
        this.typeOptions = (body.options || []).map(o => o.value || o.label);
        if (!this.formData.type && this.typeOptions.length > 0) {
          this.formData.type = this.typeOptions[0];
        }
      });
  }

  fetchOrgs(queryName = '') {
    this.organizationService.queryOrganizationPage({ queryName, code: '', page: 1, length: 50 })
      .subscribe(({ body }) => {
        this.orgOptions = (body.data || []).map(o => ({ label: o.name, value: o.id }));
        if (this.formData.organizationId) {
          this.selectedOrg = this.orgOptions.find(o => o.value === this.formData.organizationId) || null;
        }
      });
  }

  onOrgChange(selected: any) {
    this.formData.organizationId = selected?.value || null;
  }

  fetchChannels(queryName = '') {
    this.channelInfoService.queryChannelPage({ queryName, page: 1, length: 50 })
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
    const param: ChannelBusinessEdit = { ...this.formData };
    return this.channelBusinessService.addChannelBusiness(param);
  }

  updateForm() {
    const param: ChannelBusinessEdit = { ...this.formData };
    return this.channelBusinessService.updateChannelBusiness(param);
  }
}
