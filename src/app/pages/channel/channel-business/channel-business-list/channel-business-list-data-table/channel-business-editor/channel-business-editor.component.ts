import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { BusinessDirectionEnum, ChannelBusinessEdit, ChannelBusinessVO } from '../../../../../../@core/data/channel-business';
import { ChannelBusinessService } from '../../../../../../@core/services/channel-business.service';
import { OrganizationService } from '../../../../../../@core/services/organization.service';
import { ChannelInfoService } from '../../../../../../@core/services/channel-info.service';
import { AccountEntityService } from '../../../../../../@core/services/account-entity.service';

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
  typeLabelMap: { [key: string]: string } = {
    DEPOSIT: 'Deposit (入金)',
    WITHDRAWAL: 'Withdrawal (出金)',
    KYC: 'KYC (身份认证)',
    DATA: 'Data (流量充值)',
    AIRTIME: 'Airtime (话费充值)',
    PP_CARD: 'Prepaid Card (预付卡)',
    USSD_DIAL: 'USSD Dial',
    ELECTRICITY: 'Electricity (电费)',
    TV: 'TV (电视订阅)',
    POS: 'POS',
    BETTING: 'Betting (博彩)',
    PAYBILL: 'Paybill (收款)',
    DEBIT: 'Debit (代扣)',
    MOMO: 'Mobile Money',
    TRANSFER: 'Transfer (转账)',
  };

  getTypeLabel(type: string): string {
    return this.typeLabelMap[type] || type;
  }

  orgOptions: { label: string; value: number }[] = [];
  orgQueryName = '';
  selectedOrg: any = null;

  accountEntityOptions: { label: string; value: number }[] = [];
  selectedAccountEntity: any = null;

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
    private accountEntityService: AccountEntityService,
  ) {
  }

  ngOnInit(): void {
    this.formData = this.data['formData'];
    this.fetchTypeOptions();
    this.fetchOrgs();
    this.fetchChannels();
    this.fetchAccountEntities();
  }

  fetchTypeOptions() {
    this.channelBusinessService.getBusinessTypeOptions()
      .subscribe(({ body }) => {
        this.typeOptions = (body.options || []).map(o => o.value || o.label);
        if (!this.formData.type) {
          this.formData.type = this.typeOptions.find(t => t === 'WITHDRAWAL') || this.typeOptions[0] || '';
        }
      });
  }

  onTypeChange(type: any) {
    this.formData.type = type as string;
    if (this.formData.type === 'DEPOSIT') {
      this.formData.businessDirection = 'INBOUND';
    } else if (this.formData.type === 'WITHDRAWAL') {
      this.formData.businessDirection = 'OUTBOUND';
    }
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

  fetchAccountEntities() {
    this.accountEntityService.queryAccountEntityPage({ queryName: '', page: 1, length: 200 })
      .subscribe(({ body }) => {
        this.accountEntityOptions = (body.data || []).map(e => ({ label: e.name, value: e.id }));
        if (this.formData.accountEntityId) {
          this.selectedAccountEntity = this.accountEntityOptions.find(e => e.value === this.formData.accountEntityId) || null;
        }
      });
  }

  onAccountEntityChange(selected: any) {
    this.formData.accountEntityId = selected?.value || null;
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
