import { Component, Input, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../../../@core/data/base-data';
import { ApplicationPageQuery, ApplicationVO } from '../../../../../../@core/data/application';
import { ApplicationService } from '../../../../../../@core/services/application.service';
import { UserPageQuery, UserVO } from '../../../../../../@core/data/user';
import { UserService } from '../../../../../../@core/services/user.service';
import { ChannelInfoService } from '../../../../../../@core/services/channel-info.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { onFetchValidData } from '../../../../../../@shared/utils/data-table.utli';
import { EdsService } from '../../../../../../@core/services/ext-datasource.service.s';
import { AssetPageQuery, EdsAssetVO, EdsInstanceVO, InstancePageQuery } from '../../../../../../@core/data/ext-datasource';
import { CertificateService } from '../../../../../../@core/services/certificate.service';
import { CertificatePageQuery, CertificateVO } from '../../../../../../@core/data/certificate';

const EDS_TYPE_ASSET_MAP: { [key: string]: string } = {
  ALIYUN: 'ALIYUN_ECS',
  AWS: 'AWS_EC2',
  HUAWEICLOUD: 'HUAWEICLOUD_ECS',
  CRATOS: 'CRATOS_COMPUTER',
  CUSTOM_IDC: 'CUSTOM_IDC_HOST',
};

@Component({
  selector: 'app-channel-extension-editor',
  templateUrl: './channel-extension-editor.component.html',
  styleUrls: ['./channel-extension-editor.component.less'],
})
export class ChannelExtensionEditorComponent implements OnInit {

  @Input() data: any;
  channelId: number;
  activeTab = 'APPLICATION';

  extensions: any[] = [];

  get filteredExtensions(): any[] {
    return this.extensions.filter(e => e.businessType === this.activeTab);
  }

  appQueryParam = { queryName: '' };
  appTable: Table<ApplicationVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  userQueryParam = { queryName: '' };
  userRole = 'OPS';
  userTable: Table<UserVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  // Server
  edsTypeOptions: { label: string; value: string }[] = [];

  // Certificate
  certQueryParam = { queryName: '' };
  certTable: Table<CertificateVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  selectedEdsType = '';
  instanceOptions: string[] = [];
  instanceMap: { [name: string]: number } = {};
  selectedInstance = '';
  serverQueryParam = { queryName: '' };
  serverTable: Table<EdsAssetVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(
    private applicationService: ApplicationService,
    private userService: UserService,
    private edsService: EdsService,
    private certificateService: CertificateService,
    private channelInfoService: ChannelInfoService,
    private toastUtil: ToastUtil,
  ) {
  }

  ngOnInit(): void {
    this.channelId = this.data['formData']['id'];
    this.fetchExtensions();
    this.fetchAppData();
    this.fetchUserData();
    this.fetchEdsTypeOptions();
    this.fetchCertData();
  }

  onTabChange(tab: any) {
    this.activeTab = tab as string;
  }

  fetchExtensions() {
    this.channelInfoService.queryChannelExtensions({ channelId: this.channelId })
      .subscribe(({ body }) => {
        this.extensions = body || [];
      });
  }

  onDeleteExtension(ext: any) {
    this.channelInfoService.deleteChannelExtensionById({ id: ext.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
        this.fetchExtensions();
      });
  }

  // Application
  fetchAppData() {
    const param: ApplicationPageQuery = {
      queryName: this.appQueryParam.queryName,
      page: this.appTable.pager.pageIndex,
      length: this.appTable.pager.pageSize,
    };
    onFetchValidData(this.appTable, this.applicationService.queryApplicationPage(param));
  }

  appPageIndexChange(pageIndex) {
    this.appTable.pager.pageIndex = pageIndex;
    this.fetchAppData();
  }

  appPageSizeChange(pageSize) {
    this.appTable.pager.pageSize = pageSize;
    this.fetchAppData();
  }

  onAddApplication(rowItem: ApplicationVO) {
    this.addExtension('APPLICATION', rowItem.id, rowItem.name);
  }

  // User
  fetchUserData() {
    const param: UserPageQuery = {
      queryName: this.userQueryParam.queryName,
      page: this.userTable.pager.pageIndex,
      length: this.userTable.pager.pageSize,
    };
    onFetchValidData(this.userTable, this.userService.queryUserPage(param));
  }

  userPageIndexChange(pageIndex) {
    this.userTable.pager.pageIndex = pageIndex;
    this.fetchUserData();
  }

  userPageSizeChange(pageSize) {
    this.userTable.pager.pageSize = pageSize;
    this.fetchUserData();
  }

  onAddUser(rowItem: UserVO) {
    this.channelInfoService.addChannelExtension({
      channelId: this.channelId,
      businessType: 'USER',
      businessId: rowItem.id,
      role: this.userRole || 'USER',
      name: rowItem.username,
      valid: true,
      comment: '',
    }).subscribe(() => {
      this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
      this.fetchExtensions();
    });
  }

  // Server
  fetchEdsTypeOptions() {
    this.edsService.getEdsInstanceTypeDatacenterOptions()
      .subscribe(({ body }) => {
        this.edsTypeOptions = body.options || [];
      });
  }

  onEdsTypeChange(edsType: any) {
    this.selectedEdsType = edsType as string;
    this.selectedInstance = '';
    this.serverTable = JSON.parse(JSON.stringify(TABLE_DATA));
    this.fetchInstances();
  }

  fetchInstances() {
    const param: InstancePageQuery = {
      queryName: '',
      edsType: this.selectedEdsType,
      page: 1,
      length: 50,
    };
    this.edsService.queryEdsInstancePage(param)
      .subscribe(({ body }) => {
        const data = body.data || [];
        this.instanceMap = {};
        data.forEach(i => this.instanceMap[i.instanceName] = i.id);
        this.instanceOptions = data.map(i => i.instanceName);
      });
  }

  onInstanceChange(instance: any) {
    this.selectedInstance = instance;
    this.fetchServerData();
  }

  fetchServerData() {
    const instanceId = this.instanceMap[this.selectedInstance];
    if (!instanceId) return;
    const assetType = EDS_TYPE_ASSET_MAP[this.selectedEdsType] || '';
    const param: AssetPageQuery = {
      instanceId: instanceId,
      queryName: this.serverQueryParam.queryName,
      assetType: assetType,
      valid: true,
      page: this.serverTable.pager.pageIndex,
      length: this.serverTable.pager.pageSize,
    };
    onFetchValidData(this.serverTable, this.edsService.queryEdsInstanceAssetPage(param));
  }

  serverPageIndexChange(pageIndex) {
    this.serverTable.pager.pageIndex = pageIndex;
    this.fetchServerData();
  }

  serverPageSizeChange(pageSize) {
    this.serverTable.pager.pageSize = pageSize;
    this.fetchServerData();
  }

  onAddServer(rowItem: EdsAssetVO) {
    this.channelInfoService.addChannelExtension({
      channelId: this.channelId,
      businessType: 'EDS_ASSET',
      businessId: rowItem.id,
      role: 'EDS_ASSET',
      name: rowItem.name,
      valid: true,
      comment: rowItem.assetKey,
    }).subscribe(() => {
      this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
      this.fetchExtensions();
    });
  }

  // Certificate
  fetchCertData() {
    const param: CertificatePageQuery = {
      queryName: this.certQueryParam.queryName,
      page: this.certTable.pager.pageIndex,
      length: this.certTable.pager.pageSize,
    };
    onFetchValidData(this.certTable, this.certificateService.queryCertificatePage(param));
  }

  certPageIndexChange(p) { this.certTable.pager.pageIndex = p; this.fetchCertData(); }
  certPageSizeChange(s) { this.certTable.pager.pageSize = s; this.fetchCertData(); }

  onAddCertificate(rowItem: CertificateVO) {
    this.addExtension('CERTIFICATE', rowItem.id, rowItem.name);
  }

  // Common
  addExtension(businessType: string, businessId: number, name: string) {
    this.channelInfoService.addChannelExtension({
      channelId: this.channelId,
      businessType: businessType,
      businessId: businessId,
      role: businessType,
      name: name,
      valid: true,
      comment: '',
    }).subscribe(() => {
      this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
      this.fetchExtensions();
    });
  }

  addForm() {
    return null;
  }

  updateForm() {
    return null;
  }
}
