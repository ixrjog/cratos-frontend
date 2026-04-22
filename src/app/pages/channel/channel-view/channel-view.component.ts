import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef } from '@angular/core';
import { ChannelInfoService } from '../../../@core/services/channel-info.service';
import { ChannelBusinessService } from '../../../@core/services/channel-business.service';
import { EdsService } from '../../../@core/services/ext-datasource.service.s';
import { ApplicationResourceService } from '../../../@core/services/application-resource.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { ChannelInfoVO } from '../../../@core/data/channel-info';
import { ChannelBusinessVO } from '../../../@core/data/channel-business';
import { KubernetesDetailsVO } from '../../../@core/data/kubernetes';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../@shared/utils/dialog.util';
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
  lines: any[] = [];
  needDrawLines = false;
  private positionInterval: any;

  // Kubernetes
  selectedAppName = '';
  k8sLoading = false;
  kubernetesDetails: KubernetesDetailsVO = null;
  deploymentList: any[] = [];
  kubernetesApplication: any = null;

  constructor(
    private channelInfoService: ChannelInfoService,
    private channelBusinessService: ChannelBusinessService,
    private edsService: EdsService,
    private applicationResourceService: ApplicationResourceService,
    private applicationService: ApplicationService,
    private dialogUtil: DialogUtil,
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
  }

  getNetworkInfo(): string {
    return this.selectedChannel?.networkInfo?.replace(/<br\s*\/?>/gi, '\n\n') || '';
  }

  onOpenKubernetesResources(member: any) {
    this.selectedAppName = member.name;
    this.deploymentList = [];
    this.kubernetesDetails = null;
    this.k8sLoading = true;
    const country = (this.selectedChannel?.country || 'ng').toLowerCase();

    this.applicationService.getMyResourceNamespaceOptions({ applicationName: member.name })
      .subscribe(({ body }) => {
        const nsOptions = body.options || [];
        const prodNs = nsOptions.find(o => o.value?.includes('prod'));
        if (!prodNs) {
          this.k8sLoading = false;
          return;
        }
        this.applicationResourceService.queryApplicationResourceKubernetesDetails({
          applicationName: member.name,
          instanceName: '',
          namespace: prodNs.value,
          name: '',
          countryCode: country,
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
    const lineOpts = { color: themeColor, size: 2, path: 'straight' };

    // PalmPay → Business (with arrow by direction)
    const palmpayEl = this.el.nativeElement.querySelector('#palmpay-card');
    if (palmpayEl) {
      this.businesses.forEach((biz, i) => {
        const bizEl = this.el.nativeElement.querySelector(`#biz-${i}`);
        if (!bizEl) return;
        const isOutbound = biz.businessDirection === 'OUTBOUND';
        const startEl = isOutbound ? palmpayEl : bizEl;
        const endEl = isOutbound ? bizEl : palmpayEl;
        try {
          this.lines.push(new LeaderLine(startEl, endEl, {
            ...lineOpts,
            startSocket: isOutbound ? 'right' : 'left',
            endSocket: isOutbound ? 'left' : 'right',
            endPlug: 'arrow1', startPlug: 'behind',
          }));
        } catch (e) {}
      });
    }

    // Business → Channel (no arrow)
    this.businesses.forEach((biz, i) => {
      const bizEl = this.el.nativeElement.querySelector(`#biz-${i}`);
      if (!bizEl) return;
      try {
        this.lines.push(new LeaderLine(bizEl, centerEl, {
          ...lineOpts, startSocket: 'right', endSocket: 'left', endPlug: 'behind', startPlug: 'behind',
        }));
      } catch (e) {}
    });

    // Channel → Organization (no arrow)
    this.organizations.forEach(org => {
      const orgEl = this.el.nativeElement.querySelector(`#org-${org.id}`);
      if (!orgEl) return;
      try {
        this.lines.push(new LeaderLine(centerEl, orgEl, {
          ...lineOpts, startSocket: 'right', endSocket: 'left', endPlug: 'behind', startPlug: 'behind',
        }));
      } catch (e) {}
    });
  }
}
