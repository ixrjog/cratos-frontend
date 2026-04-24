import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { ChannelInfoService } from '../../../@core/services/channel-info.service';
import { ChannelBusinessService } from '../../../@core/services/channel-business.service';
import { ChannelLineService } from '../../../@core/services/channel-line.service';
import { EdsService } from '../../../@core/services/ext-datasource.service.s';
import { ApplicationResourceService } from '../../../@core/services/application-resource.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { ChannelInfoVO } from '../../../@core/data/channel-info';
import { ChannelBusinessVO } from '../../../@core/data/channel-business';
import { KubernetesDetailsVO } from '../../../@core/data/kubernetes';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../@shared/utils/toast.util';
import { DialogService } from 'ng-devui';
import { EdsAssetSshTerminalComponent } from '../../ext-datasource/eds-instance/eds-asset/eds-asset-data-table/eds-asset-ssh-terminal/eds-asset-ssh-terminal.component';
import { ChannelInfoEditorComponent } from '../channel-info/channel-info-list/channel-info-list-data-table/channel-info-editor/channel-info-editor.component';
import { ChannelBusinessEditorComponent } from '../channel-business/channel-business-list/channel-business-list-data-table/channel-business-editor/channel-business-editor.component';
import { ChannelLineEditorComponent } from '../channel-line/channel-line-list/channel-line-list-data-table/channel-line-editor/channel-line-editor.component';

declare var LeaderLine: any;

@Component({
  selector: 'app-channel-view',
  templateUrl: './channel-view.component.html',
  styleUrls: ['./channel-view.component.less'],
})
export class ChannelViewComponent implements OnInit, OnDestroy, AfterViewChecked {

  channels: ChannelInfoVO[] = [];
  selectedChannel: ChannelInfoVO = null;
  queryName = '';
  editMode = false;
  businesses: ChannelBusinessVO[] = [];
  organizations: any[] = [];
  channelLines: any[] = [];
  lineLevels: any[][] = []; // lines grouped by level for layout
  lines: any[] = [];
  needDrawLines = false;
  private positionInterval: any;

  // Kubernetes
  selectedAppName = '';
  k8sLoading = false;
  k8sCountryCode = '';
  countryCodeOptions = ['ng', 'bd', 'pk', 'ph', 'tz', 'gh', 'ug', 'za', 'ke'];
  kubernetesDetails: KubernetesDetailsVO = null;
  deploymentList: any[] = [];
  kubernetesApplication: any = null;

  constructor(
    private channelInfoService: ChannelInfoService,
    private channelBusinessService: ChannelBusinessService,
    private channelLineService: ChannelLineService,
    private edsService: EdsService,
    private applicationResourceService: ApplicationResourceService,
    private applicationService: ApplicationService,
    private dialogUtil: DialogUtil,
    private dialogService: DialogService,
    private toastUtil: ToastUtil,
    private el: ElementRef,
  ) {
  }

  ngOnInit() {
    this.fetchChannels();
    this.positionInterval = setInterval(() => {
      this.lines.forEach(line => {
        try {
          if (line._svg && line._svg.isConnected) line.position();
        } catch (e) {}
      });
    }, 500);
  }

  ngAfterViewChecked() {
    if (this.needDrawLines) {
      this.needDrawLines = false;
      setTimeout(() => {
        this.drawLines();
        // 再次刷新位置
        setTimeout(() => this.lines.forEach(l => { try { l.position(); } catch (e) {} }), 300);
      }, 300);
    }
  }

  ngOnDestroy() {
    this.removeLines();
    if (this.positionInterval) {
      clearInterval(this.positionInterval);
    }
  }

  fetchChannels() {
    this.channelInfoService.queryChannelPage({ queryName: this.queryName, page: 1, length: 50 })
      .subscribe(({ body }) => {
        this.channels = body.data || [];
      });
  }

  onSelectChannel(channel: ChannelInfoVO) {
    this.removeLines();
    this.selectedChannel = channel;
    this.selectedAppName = '';
    this.deploymentList = [];
    this.kubernetesDetails = null;
    this.fetchRelations();
  }

  fetchRelations() {
    this.channelInfoService.queryChannelExtensions({ channelId: this.selectedChannel.id })
      .subscribe(({ body }) => {
        this.selectedChannel.members = {};
        (body || []).forEach(ext => {
          if (!this.selectedChannel.members[ext.businessType]) {
            this.selectedChannel.members[ext.businessType] = [];
          }
          this.selectedChannel.members[ext.businessType].push(ext);
        });
      });

    this.channelBusinessService.queryChannelBusinessPage({
      queryName: '',
      channelId: this.selectedChannel.id,
      page: 1,
      length: 100,
    }).subscribe(({ body }) => {
      this.businesses = body.data || [];
      // Extract unique organizations
      const orgMap = new Map();
      this.businesses.forEach(biz => {
        if (biz.organization && !orgMap.has(biz.organization.id)) {
          orgMap.set(biz.organization.id, biz.organization);
        }
      });
      this.organizations = Array.from(orgMap.values());
      this.needDrawLines = true;
    });

    this.channelLineService.queryChannelLinePage({
      queryName: '',
      channelId: this.selectedChannel.id,
      page: 1,
      length: 100,
    }).subscribe(({ body }) => {
      this.channelLines = body.data || [];
      this.computeLineLevels();
    });
  }

  getNetworkInfo(): string {
    return this.selectedChannel?.networkInfo?.replace(/<br\s*\/?>/gi, '\n\n') || '';
  }

  @ViewChild('fullDocTemplate') fullDocTemplate: TemplateRef<any>;
  @ViewChild('callDialogTemplate') callDialogTemplate: TemplateRef<any>;

  callUserList: { name: string; role: string; checked: boolean }[] = [];
  callSelectAll = true;

  onOpenCallDialog() {
    const users = this.selectedChannel?.members?.['USER'] || [];
    this.callUserList = users.map(u => ({ name: u.name, role: u.role, checked: true }));
    this.callSelectAll = true;
    const results = this.dialogService.open({
      id: 'call-alert-dialog',
      width: '400px',
      backdropCloseable: true,
      dialogtype: 'standard',
      title: 'Call Alert',
      contentTemplate: this.callDialogTemplate,
      buttons: [
        {
          cssClass: 'primary',
          text: 'Call',
          handler: () => {
            const selected = this.callUserList.filter(u => u.checked).map(u => u.name);
            if (selected.length === 0) return;
            this.channelInfoService.callChannelAlert({
              channelId: this.selectedChannel.id,
              usernames: selected,
            }).subscribe(() => {
              this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
            });
            results.modalInstance.hide();
          },
        },
        {
          cssClass: 'common',
          text: 'Cancel',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  onCallSelectAllChange(checked: boolean) {
    this.callUserList.forEach(u => u.checked = checked);
  }

  onCallUserCheck() {
    this.callSelectAll = this.callUserList.every(u => u.checked);
  }

  onEditChannel() {
    if (!this.editMode) return;
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, {
      ...DIALOG_DATA.editorData, title: 'Edit Channel', content: ChannelInfoEditorComponent,
    }, () => this.fetchRelations(), this.selectedChannel);
  }

  onEditBusiness(biz: any) {
    if (!this.editMode) return;
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, {
      ...DIALOG_DATA.editorData, title: 'Edit Business', content: ChannelBusinessEditorComponent,
    }, () => this.fetchRelations(), biz);
  }

  onEditLine(line: any) {
    if (!this.editMode) return;
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, {
      ...DIALOG_DATA.editorData, title: 'Edit Line', content: ChannelLineEditorComponent,
    }, () => this.fetchRelations(), line);
  }

  onShowFullDoc() {
    this.dialogService.open({
      id: 'full-doc-dialog',
      width: '60%',
      maxHeight: '800px',
      backdropCloseable: true,
      dialogtype: 'standard',
      title: 'Network Info',
      contentTemplate: this.fullDocTemplate,
      buttons: [],
    });
  }

  private k8sNamespace = '';

  onOpenKubernetesResources(member: any) {
    this.selectedAppName = member.name;
    this.k8sCountryCode = (this.selectedChannel?.country || 'ng').toLowerCase();
    this.deploymentList = [];
    this.kubernetesDetails = null;
    this.k8sLoading = true;

    this.applicationService.getMyResourceNamespaceOptions({ applicationName: member.name })
      .subscribe(({ body }) => {
        const nsOptions = body.options || [];
        const prodNs = nsOptions.find(o => o.value?.includes('prod'));
        if (!prodNs) {
          this.k8sLoading = false;
          return;
        }
        this.k8sNamespace = prodNs.value;
        this.fetchK8sDeployments();
      }, () => {
        this.k8sLoading = false;
      });
  }

  onK8sCountryCodeChange(cc: any) {
    this.k8sCountryCode = cc as string;
    this.fetchK8sDeployments();
  }

  fetchK8sDeployments() {
    if (!this.selectedAppName || !this.k8sNamespace) return;
    this.k8sLoading = true;
    this.deploymentList = [];
    this.applicationResourceService.queryApplicationResourceKubernetesDetails({
      applicationName: this.selectedAppName,
      instanceName: '',
      namespace: this.k8sNamespace,
      name: '',
      countryCode: this.k8sCountryCode,
    }).subscribe(({ body: result }) => {
      this.k8sLoading = false;
      if (result.body.success) {
        this.kubernetesDetails = result.body;
        this.deploymentList = this.kubernetesDetails?.workloads?.deployments || [];
        this.kubernetesApplication = this.kubernetesDetails?.application;
      }
    }, () => {
      this.k8sLoading = false;
    });
  }

  onServerLogin(member: any) {
    this.edsService.getEdsInstanceAsset({ id: member.businessId })
      .subscribe(({ body }) => {
        const dialogDate = {
          ...DIALOG_DATA.editorData,
          width: '60%',
          height: '800px',
          content: EdsAssetSshTerminalComponent,
          title: 'Asset Login',
        };
        this.dialogUtil.onEditWithoutButtonDialog(UPDATE_OPERATION, dialogDate, () => null, body);
      });
  }

  getLineIndex(line: any): number {
    return this.channelLines.findIndex(l => l.name === line.name);
  }

  isNetworkLine(lineType: string): boolean {
    return ['LEASED_LINE', 'IPSEC_VPN', 'INTERNET'].includes(lineType);
  }

  computeLineLevels() {
    this.lineLevels = [];
    if (!this.channelLines.length) return;

    // Merge lines with same name (keep first, aggregate ids and sourceEndpoints)
    const mergedMap = new Map<string, any>();
    this.channelLines.forEach(l => {
      if (mergedMap.has(l.name)) {
        const existing = mergedMap.get(l.name);
        existing.mergedIds.push(l.id);
        if (!existing.sourceEndpoints.includes(l.sourceEndpoint)) {
          existing.sourceEndpoints.push(l.sourceEndpoint);
        }
        if (l.linkedChannel) existing.linkedChannel = true;
      } else {
        mergedMap.set(l.name, { ...l, mergedIds: [l.id], sourceEndpoints: [l.sourceEndpoint], linkedChannel: !!l.linkedChannel });
      }
    });
    const mergedLines = Array.from(mergedMap.values());
    // A merged line is root if any of its sourceEndpoints is "."
    mergedLines.forEach(l => l.isRoot = l.sourceEndpoints.includes('.'));

    const placed = new Set<string>();
    let currentLevel = mergedLines.filter(l => l.isRoot);
    while (currentLevel.length > 0) {
      this.lineLevels.push(currentLevel);
      currentLevel.forEach(l => placed.add(l.name));
      currentLevel = mergedLines.filter(l => !placed.has(l.name) && l.sourceEndpoints.some(s => placed.has(s)));
    }
    const remaining = mergedLines.filter(l => !placed.has(l.name));
    if (remaining.length) this.lineLevels.push(remaining);

    // Update channelLines to merged version for drawLines
    this.channelLines = mergedLines;
  }

  removeLines() {
    this.lines.forEach(line => {
      try { line.remove(); } catch (e) {}
    });
    this.lines = [];
  }

  drawLines() {
    this.removeLines();
    const centerEl = this.el.nativeElement.querySelector('#channel-center-card');
    if (!centerEl) return;
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--devui-brand').trim() || '#5e7ce0';
    const noArrow = { color: themeColor, size: 2, path: 'straight', startSocket: 'right', endSocket: 'left', endPlug: 'behind', startPlug: 'behind' };

    // Build line element map by index
    const lineElMap = new Map<number, HTMLElement>();
    const lineByName = new Map<string, number>(); // name → index
    this.channelLines.forEach((line, j) => {
      const el = this.el.nativeElement.querySelector(`#line-${j}`);
      if (el) {
        lineElMap.set(j, el);
        lineByName.set(line.name, j);
      }
    });

    // Identify root lines (sourceEndpoint === ".") and child lines
    const rootLineIndices = new Set<number>();
    const terminalLineIndices = new Set<number>(); // lines that connect to channel (no child points to them)
    const childTargets = new Set<number>(); // lines that are targets of other lines

    this.channelLines.forEach((line, j) => {
      if (line.isRoot) {
        rootLineIndices.add(j);
      }
    });

    // Business → root lines only (match by line name, deduplicated)
    const bizConnected = new Set<string>();
    this.businesses.forEach((biz, i) => {
      const bizEl = this.el.nativeElement.querySelector(`#biz-${i}`);
      if (!bizEl) return;
      (biz.lines || []).forEach(bizLine => {
        // Find merged line by name
        const lineIdx = this.channelLines.findIndex(l => l.name === bizLine.name);
        if (lineIdx < 0) return;
        const mergedLine = this.channelLines[lineIdx];
        if (!mergedLine.isRoot) return;
        const key = `${i}-${mergedLine.name}`;
        if (bizConnected.has(key)) return;
        bizConnected.add(key);
        const lineEl = lineElMap.get(lineIdx);
        if (!lineEl) return;
        const isOutbound = biz.businessDirection === 'OUTBOUND';
        try {
          this.lines.push(new LeaderLine(
            isOutbound ? bizEl : lineEl,
            isOutbound ? lineEl : bizEl,
            { color: themeColor, size: 2, path: 'straight',
              startSocket: 'right', endSocket: 'left',
              endPlug: 'arrow1', startPlug: 'behind' }
          ));
        } catch (e) {}
      });
    });

    // Line → Line (non-root connects to lines whose name is in sourceEndpoints)
    this.channelLines.forEach((line, j) => {
      if (line.isRoot) return;
      (line.sourceEndpoints || []).forEach(sep => {
        if (sep === '.') return;
        const parentIdx = lineByName.get(sep);
        if (parentIdx === undefined) return;
        const parentEl = lineElMap.get(parentIdx);
        const childEl = lineElMap.get(j);
        if (!parentEl || !childEl) return;
        try { this.lines.push(new LeaderLine(parentEl, childEl, noArrow)); } catch (e) {}
      });
    });

    // Terminal lines → Channel
    // Lines with linkedChannel → Channel
    this.channelLines.forEach((line, j) => {
      if (!line.linkedChannel) return;
      const lineEl = lineElMap.get(j);
      if (!lineEl) return;
      try { this.lines.push(new LeaderLine(lineEl, centerEl, noArrow)); } catch (e) {}
    });

    // If no lines, Business → Channel directly
    if (!this.channelLines.length) {
      this.businesses.forEach((_, i) => {
        const bizEl = this.el.nativeElement.querySelector(`#biz-${i}`);
        if (!bizEl) return;
        try { this.lines.push(new LeaderLine(bizEl, centerEl, noArrow)); } catch (e) {}
      });
    }

    // Channel → Organization (no arrow)
    this.organizations.forEach(org => {
      const orgEl = this.el.nativeElement.querySelector(`#org-${org.id}`);
      if (!orgEl) return;
      try { this.lines.push(new LeaderLine(centerEl, orgEl, noArrow)); } catch (e) {}
    });
  }
}
