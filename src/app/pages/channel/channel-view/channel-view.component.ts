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
  businesses: ChannelBusinessVO[] = [];
  organizations: any[] = [];
  channelLines: any[] = [];
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
        try { line.position(); } catch (e) {}
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
    const palmpayEl = this.el.nativeElement.querySelector('#palmpay-card');

    // PalmPay → Business (with arrow by direction)
    if (palmpayEl) {
      this.businesses.forEach((biz, i) => {
        const bizEl = this.el.nativeElement.querySelector(`#biz-${i}`);
        if (!bizEl) return;
        const isOutbound = biz.businessDirection === 'OUTBOUND';
        try {
          this.lines.push(new LeaderLine(
            isOutbound ? palmpayEl : bizEl,
            isOutbound ? bizEl : palmpayEl,
            { color: themeColor, size: 2, path: 'straight',
              startSocket: isOutbound ? 'right' : 'left',
              endSocket: isOutbound ? 'left' : 'right',
              endPlug: 'arrow1', startPlug: 'behind' }
          ));
        } catch (e) {}
      });
    }

    // Business → Line (no arrow, match by business.lines)
    this.businesses.forEach((biz, i) => {
      const bizEl = this.el.nativeElement.querySelector(`#biz-${i}`);
      if (!bizEl) return;
      (biz.lines || []).forEach(bizLine => {
        const lineIdx = this.channelLines.findIndex(l => l.id === bizLine.id);
        if (lineIdx < 0) return;
        const lineEl = this.el.nativeElement.querySelector(`#line-${lineIdx}`);
        if (!lineEl) return;
        try { this.lines.push(new LeaderLine(bizEl, lineEl, noArrow)); } catch (e) {}
      });
    });

    // Line → Channel (no arrow)
    this.channelLines.forEach((_, j) => {
      const lineEl = this.el.nativeElement.querySelector(`#line-${j}`);
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
