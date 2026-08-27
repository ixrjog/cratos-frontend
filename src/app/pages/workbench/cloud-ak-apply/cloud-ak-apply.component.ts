import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../@core/services/api.service';
import { ToastUtil } from '../../../@shared/utils/toast.util';
import { map } from 'rxjs/operators';

/**
 * 云 AK/SK 申请
 * 列表: POST /api/cloud/ak/apply/page/query
 * 申请: POST /api/cloud/ak/apply/create
 */
@Component({
  selector: 'app-cloud-ak-apply',
  templateUrl: './cloud-ak-apply.component.html',
  styleUrls: ['./cloud-ak-apply.component.less'],
})
export class CloudAkApplyComponent implements OnInit {

  // 第2章核心承诺(与后端《AK/SK申请与安全管理规范》一致)
  readonly commitments = [
    '能安全使用并保证不泄漏 AK/SK，不以任何形式对外扩散；',
    '对于对象存储类(S3 / OSS / OBS)的 AK/SK，保证所访问的数据不被泄漏；',
    '知悉并接受：若 AK 泄漏，将按泄漏数据条目数与是否属于敏感数据定责任并强制复盘。',
  ];

  readonly statusOptions = ['', 'CREATED', 'ISSUED', 'EXTRACTED', 'EXPIRED', 'REVOKED'];

  // 云类型 tab(目前仅 ALIYUN，后续可扩展 AWS/GCP 等)
  readonly cloudTypes = [
    { id: 'ALIYUN', label: 'ALIYUN' },
  ];

  // 列表
  applyList: any[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  queryName = '';
  applyStatus = '';
  loading = false;

  // 云实例下拉
  instances: any[] = [];
  instanceLoading = false;

  // 申请弹窗
  showApplyDialog = false;
  selectedCloudType = 'ALIYUN';
  selectedInstance: any = null;
  applyReason = '';
  akAccountName = '';
  commitmentAgreed = false;
  submitting = false;

  constructor(private apiService: ApiService, private toastUtil: ToastUtil) {}

  ngOnInit(): void {
    this.queryPage();
  }

  queryPage() {
    this.loading = true;
    this.apiService.post('/cloud', '/ak/apply/page/query', {
      queryName: this.queryName,
      applyStatus: this.applyStatus || null,
      page: this.pageIndex,
      length: this.pageSize,
    }).subscribe(({ body }: any) => {
      this.applyList = body?.data || [];
      this.total = body?.totalNum || 0;
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  onSearch() {
    this.pageIndex = 1;
    this.queryPage();
  }

  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.queryPage();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.queryPage();
  }

  statusLabelStyle(status: string): string {
    switch (status) {
      case 'ISSUED':
        return 'green-w98';
      case 'EXTRACTED':
        return 'green-w98';
      case 'EXPIRED':
        return 'gray-w98';
      case 'REVOKED':
        return 'red-w98';
      default:
        return 'blue-w98';
    }
  }

  // ===== 申请弹窗 =====
  onOpenApply() {
    this.selectedCloudType = this.cloudTypes[0].id;
    this.selectedInstance = null;
    this.applyReason = '';
    this.akAccountName = '';
    this.commitmentAgreed = false;
    this.showApplyDialog = true;
    this.fetchInstances();
  }

  onCloseApply() {
    this.showApplyDialog = false;
  }

  onCloudTypeChange(type: string) {
    this.selectedCloudType = type;
    this.selectedInstance = null;
    this.fetchInstances();
  }

  fetchInstances() {
    this.instanceLoading = true;
    this.instances = [];
    this.apiService.post('/eds', '/instance/page/query', {
      queryName: '',
      edsType: this.selectedCloudType,
      page: 1,
      length: 200,
    }).subscribe(({ body }: any) => {
      this.instances = body?.data || [];
      this.instanceLoading = false;
    }, () => {
      this.instanceLoading = false;
    });
  }

  get canSubmit(): boolean {
    return (
      !!this.selectedInstance &&
      !!this.applyReason.trim() &&
      this.akAccountNameValid &&
      this.commitmentAgreed &&
      !this.submitting
    );
  }

  // AK 账户名格式: ak- 开头, 小写字母/数字, 以 - 连接, 末尾无 -, 无其他特殊字符; 可选(空时不校验)
  private static readonly AK_ACCOUNT_NAME_PATTERN = /^ak-[a-z0-9]+(-[a-z0-9]+)*$/;

  get akAccountNameValid(): boolean {
    const v = (this.akAccountName || '').trim();
    if (!v) {
      return true;
    }
    return CloudAkApplyComponent.AK_ACCOUNT_NAME_PATTERN.test(v);
  }

  onSubmit() {
    if (!this.canSubmit) {
      return;
    }
    this.submitting = true;
    this.apiService.post('/cloud', '/ak/apply/create', {
      instanceId: this.selectedInstance?.id,
      applyReason: this.applyReason.trim(),
      akAccountName: this.akAccountName?.trim() || null,
      commitmentAgreed: this.commitmentAgreed,
    }).subscribe(() => {
      this.submitting = false;
      this.showApplyDialog = false;
      this.toastUtil.onSuccessToast('AK/SK 申请已提交');
      this.pageIndex = 1;
      this.queryPage();
    }, () => {
      this.submitting = false;
    });
  }

  // ===== 处理(创建 AK RAM 账户)弹窗 =====
  showProcessDialog = false;
  processRow: any = null;
  processCloudType = 'ALIYUN';
  processInstances: any[] = [];
  processInstanceLoading = false;
  processInstance: any = null;
  processAkAccountName = '';
  processComment = '';
  processing = false;

  private static readonly PROCESS_AK_PATTERN = /^ak-[a-z0-9]+(-[a-z0-9]+)*$/;

  onProcess(rowItem: any) {
    this.processRow = rowItem;
    this.processCloudType = this.cloudTypes[0].id;
    this.processInstance = null;
    this.processAkAccountName = rowItem?.akAccountName || '';
    this.processComment = '';
    this.showProcessDialog = true;
    this.fetchProcessInstances(rowItem?.instanceId);
  }

  onCloseProcess() {
    this.showProcessDialog = false;
  }

  onProcessCloudTypeChange(type: string) {
    this.processCloudType = type;
    this.processInstance = null;
    this.fetchProcessInstances();
  }

  fetchProcessInstances(preselectInstanceId?: number) {
    this.processInstanceLoading = true;
    this.processInstances = [];
    this.apiService.post('/eds', '/instance/page/query', {
      queryName: '',
      edsType: this.processCloudType,
      page: 1,
      length: 200,
    }).subscribe(({ body }: any) => {
      this.processInstances = body?.data || [];
      // 尽量预选申请单原来的云实例
      if (preselectInstanceId) {
        this.processInstance = this.processInstances.find(i => i.id === preselectInstanceId) || null;
      }
      this.processInstanceLoading = false;
    }, () => {
      this.processInstanceLoading = false;
    });
  }

  get processAkAccountNameValid(): boolean {
    const v = (this.processAkAccountName || '').trim();
    if (!v) {
      return false;
    }
    return CloudAkApplyComponent.PROCESS_AK_PATTERN.test(v);
  }

  get canProcess(): boolean {
    return (
      !!this.processRow &&
      !!this.processInstance &&
      this.processAkAccountNameValid &&
      !this.processing
    );
  }

  submitProcess() {
    if (!this.canProcess) {
      return;
    }
    this.processing = true;
    this.apiService.post('/cloud', '/ak/apply/process', {
      id: this.processRow.id,
      instanceId: this.processInstance?.id,
      akAccountName: this.processAkAccountName.trim(),
      comment: this.processComment?.trim() || null,
    }).subscribe(() => {
      this.processing = false;
      this.showProcessDialog = false;
      this.toastUtil.onSuccessToast('申请已处理，AK RAM 账户已创建');
      this.queryPage();
    }, () => {
      this.processing = false;
    });
  }

  // ===== 配置详情弹窗(阿里云实例 + RAM 账户信息) =====
  showConfigDialog = false;
  configLoading = false;
  configDetail: any = null;
  configApplyId: number | null = null;
  configInstanceId: number | null = null;

  // 策略下拉查询 / 附加
  policyLoading = false;
  selectedPolicy: any = null;
  attaching = false;

  onConfig(rowItem: any) {
    this.configDetail = null;
    this.configApplyId = rowItem.id;
    this.configInstanceId = rowItem.instanceId;
    this.selectedPolicy = null;
    this.showConfigDialog = true;
    this.loadConfigDetail();
  }

  loadConfigDetail() {
    if (this.configApplyId == null) {
      return;
    }
    this.configLoading = true;
    this.apiService.post('/cloud', '/ak/apply/config/query', {
      id: this.configApplyId,
    }).subscribe(({ body }: any) => {
      this.configDetail = body || null;
      this.configLoading = false;
    }, () => {
      this.configLoading = false;
    });
  }

  /** 附加策略: 输入关键词后走后端 API 查询(而非前端过滤) */
  onSearchPolicy = (term: string) => {
    return this.apiService.post('/cloud', '/ak/apply/aliyun/policy/query', {
      instanceId: this.configInstanceId,
      policyName: term || '',
    }).pipe(
      map(({ body }: any) => (body || []).map((p: any, i: number) => ({ id: i, option: p }))),
    );
  };

  /** 解析 AccessKey 策略(兼容对象或 JSON 字符串) */
  akPolicy(): any {
    const raw = this.configDetail?.accessKeyPolicy;
    if (!raw) {
      return null;
    }
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    return raw;
  }

  akpVersion(p: any): any {
    return p?.Version ?? p?.version;
  }

  akpStatus(p: any): any {
    return p?.Status ?? p?.status;
  }

  akpStatements(p: any): any[] {
    return p?.Statements ?? p?.statements ?? [];
  }

  stmtType(s: any): string {
    return s?.Type ?? s?.type ?? '';
  }

  stmtValue(s: any): string {
    return s?.Value ?? s?.value ?? '';
  }

  stmtIpList(s: any): string[] {
    return s?.IPList ?? s?.ipList ?? [];
  }

  // ===== AccessKey 网络访问限制策略: 在线编辑 =====
  akEditing = false;
  akSaving = false;
  akEditModel: { statements: { type: string; value: string; ipText: string }[] } = null;
  readonly akTypeOptions = ['ClassicWhiteList', 'VPCWhiteList'];

  onEditAkPolicy() {
    const p = this.akPolicy();
    const statements = this.akpStatements(p)
      .map((s: any) => ({
        type: this.stmtType(s) || 'ClassicWhiteList',
        value: this.stmtValue(s) || '',
        ipText: this.stmtIpList(s)
          .join('\n'),
      }));
    this.akEditModel = {
      statements: statements.length ? statements : [{ type: 'ClassicWhiteList', value: '', ipText: '' }],
    };
    this.akEditing = true;
  }

  addAkStatement() {
    this.akEditModel?.statements.push({ type: 'ClassicWhiteList', value: '', ipText: '' });
  }

  removeAkStatement(index: number) {
    this.akEditModel?.statements.splice(index, 1);
  }

  onCancelAkEdit() {
    this.akEditing = false;
    this.akEditModel = null;
  }

  onSaveAkPolicy() {
    if (!this.akEditModel || this.akSaving) {
      return;
    }
    const statements = this.akEditModel.statements.map(s => {
      const ipList = (s.ipText || '')
        .split(/\r?\n/)
        .map(v => v.trim())
        .filter(v => v.length > 0);
      const stmt: any = { Type: s.type, IPList: ipList };
      // 仅 VPCWhiteList 携带 Value(VPC 实例 ID)
      if (s.type === 'VPCWhiteList' && s.value && s.value.trim()) {
        stmt.Value = s.value.trim();
      }
      return stmt;
    });
    const policy = {
      Version: 1,
      Status: 'Active',
      Statements: statements,
    };
    this.akSaving = true;
    this.apiService.post('/cloud', '/ak/apply/aliyun/accesskey/policy/update', {
      id: this.configApplyId,
      accessKeyPolicy: JSON.stringify(policy),
    }).subscribe(() => {
      this.akSaving = false;
      this.akEditing = false;
      this.akEditModel = null;
      this.toastUtil.onSuccessToast('AccessKey 网络访问限制策略已更新');
      this.loadConfigDetail();
    }, () => {
      this.akSaving = false;
    });
  }

  get canAttachPolicy(): boolean {
    return !!this.selectedPolicy && this.configApplyId != null && !this.attaching;
  }

  onAttachPolicy() {
    if (!this.canAttachPolicy) {
      return;
    }
    this.attaching = true;
    this.apiService.post('/cloud', '/ak/apply/aliyun/policy/attach', {
      id: this.configApplyId,
      policyName: this.selectedPolicy?.assetKey,
      policyType: this.selectedPolicy?.kind,
    }).subscribe(() => {
      this.attaching = false;
      this.toastUtil.onSuccessToast('策略已附加');
      this.selectedPolicy = null;
      // 刷新已附加策略列表
      this.loadConfigDetail();
    }, () => {
      this.attaching = false;
    });
  }

  onCloseConfig() {
    this.showConfigDialog = false;
  }

  // ===== 提取 AK/SK 弹窗 =====
  showExtractDialog = false;
  extractLoading = false;
  extractRow: any = null;
  extractSecret: any = null;

  onExtract(rowItem: any) {
    this.extractRow = rowItem;
    this.extractSecret = null;
    this.showExtractDialog = true;
  }

  // 是否使用生物识别(WebAuthn)登录：提取 AK/SK 的前置条件
  get biometricAuthenticated(): boolean {
    return localStorage.getItem('loginMethod') === 'webauthn';
  }

  submitExtract() {
    if (this.extractLoading || !this.extractRow) {
      return;
    }
    if (!this.biometricAuthenticated) {
      this.toastUtil.onErrorToast('请使用生物识别认证登录后再提取 AK/SK');
      return;
    }
    this.extractLoading = true;
    this.apiService.post('/cloud', '/ak/apply/extract', {
      id: this.extractRow.id,
    }).subscribe(({ body }: any) => {
      this.extractSecret = body || null;
      this.extractLoading = false;
      // 提取后状态变为 EXTRACTED，刷新列表
      this.queryPage();
    }, () => {
      this.extractLoading = false;
    });
  }

  onCopied() {
    this.toastUtil.onSuccessToast('已复制到剪贴板');
  }

  onCloseExtract() {
    this.showExtractDialog = false;
    this.extractRow = null;
    this.extractSecret = null;
  }
}
