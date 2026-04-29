import { Component, Input, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { BusinessDirectionEnum, ChannelBusinessEdit, ChannelBusinessVO } from '../../../../../../@core/data/channel-business';
import { ChannelBusinessService } from '../../../../../../@core/services/channel-business.service';
import { OrganizationService } from '../../../../../../@core/services/organization.service';
import { ChannelInfoService } from '../../../../../../@core/services/channel-info.service';
import { AccountEntityService } from '../../../../../../@core/services/account-entity.service';
import { map } from 'rxjs/operators';

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
    this.organizationService.queryOrganizationPage({ queryName, code: '', page: 1, length: 10 })
      .subscribe(({ body }) => {
        const list = (body.data || []).map(o => ({ label: o.name, value: o.id }));
        const org = this.formData.organization;
        const orgId = this.formData.organizationId || org?.id;
        if (orgId && org && !list.find(o => o.value === orgId)) {
          list.unshift({ label: org.name, value: org.id });
        }
        this.orgOptions = list;
        if (orgId && !this.selectedOrg) {
          this.selectedOrg = this.orgOptions.find(o => o.value === orgId) || null;
        }
      });
  }

  onOrgChange(selected: any) {
    this.formData.organizationId = selected?.value || null;
  }

  onSearchOrg = (term: string) => {
    return this.organizationService.queryOrganizationPage({ queryName: term, code: '', page: 1, length: 10 })
      .pipe(map(({ body }) => (body.data || []).map((o, i) => ({ id: i, option: o }))));
  };

  onSearchAccountEntity = (term: string) => {
    return this.accountEntityService.queryAccountEntityPage({ queryName: term, page: 1, length: 10 })
      .pipe(map(({ body }) => (body.data || []).map((e, i) => ({ id: i, option: e }))));
  };

  onSearchChannel = (term: string) => {
    return this.channelInfoService.queryChannelPage({ queryName: term, page: 1, length: 10 })
      .pipe(map(({ body }) => (body.data || []).map((c, i) => ({ id: i, option: c }))));
  };

  fetchAccountEntities(queryName = '') {
    this.accountEntityService.queryAccountEntityPage({ queryName, page: 1, length: 10 })
      .subscribe(({ body }) => {
        const list = (body.data || []).map(e => ({ label: e.name, value: e.id }));
        // Ensure current selection stays in list
        const ae = this.formData['accountEntity'];
        const aeId = this.formData.accountEntityId || ae?.id;
        if (aeId && ae && !list.find(e => e.value === aeId)) {
          list.unshift({ label: ae.name, value: ae.id });
        }
        this.accountEntityOptions = list;
        // Only set selection on first load
        if (aeId && !this.selectedAccountEntity) {
          this.formData.accountEntityId = aeId;
          this.selectedAccountEntity = this.accountEntityOptions.find(e => e.value === aeId) || null;
        }
      });
  }

  onAccountEntityChange(selected: any) {
    this.formData.accountEntityId = selected?.value || null;
  }

  fetchChannels(queryName = '') {
    this.channelInfoService.queryChannelPage({ queryName, page: 1, length: 10 })
      .subscribe(({ body }) => {
        const list = (body.data || []).map(c => ({ label: c.name, value: c.id }));
        const ch = this.formData.channel;
        const chId = this.formData.channelId || ch?.id;
        if (chId && ch && !list.find(c => c.value === chId)) {
          list.unshift({ label: ch.name, value: ch.id });
        }
        this.channelOptions = list;
        if (chId && !this.selectedChannel) {
          this.selectedChannel = this.channelOptions.find(c => c.value === chId) || null;
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
