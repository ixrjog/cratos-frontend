import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { ChannelInfoService } from '../../../@core/services/channel-info.service';
import { ChannelBusinessService } from '../../../@core/services/channel-business.service';
import { ChannelNodeService } from '../../../@core/services/channel-line.service';
import ELK from 'elkjs/lib/elk.bundled';
import { EdsService } from '../../../@core/services/ext-datasource.service.s';
import { ApplicationResourceService } from '../../../@core/services/application-resource.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { ChannelInfoVO } from '../../../@core/data/channel-info';
import { ChannelBusinessVO } from '../../../@core/data/channel-business';
import { KubernetesDetailsVO } from '../../../@core/data/kubernetes';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION, ADD_OPERATION } from '../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../@shared/utils/toast.util';
import { DialogService } from 'ng-devui';
import { EdsAssetSshTerminalComponent } from '../../ext-datasource/eds-instance/eds-asset/eds-asset-data-table/eds-asset-ssh-terminal/eds-asset-ssh-terminal.component';
import { ChannelInfoEditorComponent } from '../channel-info/channel-info-list/channel-info-list-data-table/channel-info-editor/channel-info-editor.component';
import { ChannelBusinessEditorComponent } from '../channel-business/channel-business-list/channel-business-list-data-table/channel-business-editor/channel-business-editor.component';
import { ChannelNodeEditorComponent } from '../channel-line/channel-line-list/channel-line-list-data-table/channel-line-editor/channel-line-editor.component';

declare var LeaderLine: any;

@Component({
  selector: 'app-channel-view',
  templateUrl: './channel-view.component.html',
  styleUrls: ['./channel-view.component.less'],
})
export class ChannelViewComponent implements OnInit, OnDestroy, AfterViewChecked {

  static readonly CHANNEL_STORAGE_KEY = 'channel_view_selected';

  channels: ChannelInfoVO[] = [];
  selectedChannel: ChannelInfoVO = null;
  queryName = '';
  editMode = false;
  businesses: ChannelBusinessVO[] = [];
  organizations: any[] = [];
  channelNodes: any[] = [];
  nodeLevels: any[][] = [];
  hiddenNodesList: any[] = [];
  lines: any[] = [];
  elkNodes: any[] = [];
  elkLines: any[] = [];
  elkGraphHeight = 600;
  private elk = new ELK();
  needDrawLines = false;
  private positionInterval: any;
  private resizeObserver: ResizeObserver;
  private resizeTimer: any;
  private lastWidth = 0;

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
    private channelNodeService: ChannelNodeService,
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
      this.elkLines.forEach(line => {
        try {
          if (line._svg && line._svg.isConnected) line.position();
        } catch (e) {}
      });
    }, 500);

    // Redraw on layout width change (sidebar toggle, window resize)
    this.lastWidth = this.el.nativeElement.offsetWidth;
    this.resizeObserver = new ResizeObserver(() => {
      const w = this.el.nativeElement.offsetWidth;
      if (w !== this.lastWidth) {
        this.lastWidth = w;
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          this.removeLines();
          this.needDrawLines = true;
        }, 400);
      }
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  scheduleRedraw() {
    this.removeLines();
    this.needDrawLines = true;
  }

  onToggleEditMode() {
    this.removeLines();
    this.editMode = !this.editMode;
    this.needDrawLines = true;
  }

  ngAfterViewChecked() {
    if (this.needDrawLines) {
      this.needDrawLines = false;
      setTimeout(() => {
        this.drawLines();
        setTimeout(() => this.lines.forEach(l => { try { l.position(); } catch (e) {} }), 200);
      }, 200);
    }
  }

  ngOnDestroy() {
    this.removeLines();
    this.elkLines.forEach(l => { try { l.remove(); } catch (e) {} });
    if (this.positionInterval) clearInterval(this.positionInterval);
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  fetchChannels() {
    this.channelInfoService.queryChannelPage({ queryName: this.queryName, page: 1, length: 50 })
      .subscribe(({ body }) => {
        this.channels = body.data || [];
        if (!this.selectedChannel) {
          const saved = localStorage.getItem(ChannelViewComponent.CHANNEL_STORAGE_KEY);
          if (saved) {
            try {
              const { id } = JSON.parse(saved);
              const match = this.channels.find(c => c.id === id);
              if (match) this.onSelectChannel(match);
            } catch (e) {}
          }
        }
      });
  }

  onSelectChannel(channel: ChannelInfoVO) {
    this.removeLines();
    this.elkLines.forEach(l => { try { l.remove(); } catch (e) {} });
    this.elkNodes = [];
    this.selectedChannel = channel;
    localStorage.setItem(ChannelViewComponent.CHANNEL_STORAGE_KEY, JSON.stringify({ id: channel.id, name: channel.name }));
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
      const orgMap = new Map();
      this.businesses.forEach(biz => {
        if (biz.organization && !orgMap.has(biz.organization.id)) {
          orgMap.set(biz.organization.id, biz.organization);
        }
      });
      this.organizations = Array.from(orgMap.values());

      this.channelNodeService.queryChannelNodePage({
        queryName: '',
        channelId: this.selectedChannel.id,
        page: 1,
        length: 100,
      }).subscribe(({ body: nodeBody }) => {
        this.channelNodes = nodeBody.data || [];
        this.computeLineLevels();
        this.needDrawLines = true;
      });
    });
  }

  getNetworkInfo(): string {
    return this.selectedChannel?.networkInfo?.replace(/<br\s*\/?>/gi, '\n\n') || '';
  }

  @ViewChild('fullDocTemplate') fullDocTemplate: TemplateRef<any>;
  @ViewChild('callDialogTemplate') callDialogTemplate: TemplateRef<any>;
  @ViewChild('nodeInfoTemplate') nodeInfoTemplate: TemplateRef<any>;
  nodeInfoContent = '';

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

  onEditNode(line: any) {
    if (!this.editMode) return;
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, {
      ...DIALOG_DATA.editorData, title: 'Edit Node', content: ChannelNodeEditorComponent,
    }, () => this.fetchRelations(), line);
  }

  onAddNode() {
    const newNode = {
      channelId: this.selectedChannel.id,
      channelName: this.selectedChannel.name,
      name: '', nodeType: '', sourceEndpoint: '', monitorUrl: '',
      linkedChannel: false, valid: true, comment: '', nodeInfo: '',
    };
    this.dialogUtil.onEditDialog(ADD_OPERATION, {
      ...DIALOG_DATA.editorData, title: 'New Node', content: ChannelNodeEditorComponent,
    }, () => this.fetchRelations(), newNode);
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

  onShowNodeInfo(line: any) {
    this.nodeInfoContent = (line.nodeInfo || '').replace(/<br\s*\/?>/gi, '\n\n');
    this.dialogService.open({
      id: 'node-info-dialog',
      width: '60%',
      maxHeight: '800px',
      backdropCloseable: true,
      dialogtype: 'standard',
      title: line.name + ' - Node Info',
      contentTemplate: this.nodeInfoTemplate,
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

  getNodeIndex(line: any): number {
    return this.channelNodes.findIndex(l => l.name === line.name);
  }

  isNetworkNode(nodeType: string): boolean {
    return ['LEASED_LINE', 'IPSEC_VPN', 'INTERNET'].includes(nodeType);
  }

  getHiddenLabel(nodeName: string): string {
    const node = this.hiddenNodesList.find(n => n.name === nodeName);
    return node ? `#${node.hiddenNum} ${node.nodeType}` : '';
  }

  isDashedType(nodeType: string): boolean {
    return nodeType === 'IPSEC_VPN' || nodeType === 'INTERNET';
  }

  getDaysRemaining(date: string): number {
    return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  }

  computeLineLevels() {
    this.nodeLevels = [];
    if (!this.channelNodes.length) return;

    // Merge lines with same name (keep first, aggregate ids and sourceEndpoints)
    const mergedMap = new Map<string, any>();
    this.channelNodes.forEach(l => {
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
      this.nodeLevels.push(currentLevel);
      currentLevel.forEach(l => placed.add(l.name));
      currentLevel = mergedLines.filter(l => !placed.has(l.name) && l.sourceEndpoints.some(s => placed.has(s)));
    }
    const remaining = mergedLines.filter(l => !placed.has(l.name));
    if (remaining.length) this.nodeLevels.push(remaining);

    // Update channelNodes to merged version for drawLines
    this.channelNodes = mergedLines;

    // Assign numbers to hidden nodes
    const hiddenTypes = ['LEASED_LINE', 'IPSEC_VPN', 'INTERNET'];
    let num = 1;
    this.hiddenNodesList = mergedLines
      .filter(l => hiddenTypes.includes(l.nodeType))
      .map(l => ({ ...l, hiddenNum: num++ }));
    // Also set hiddenNum on channelNodes for label lookup
    this.hiddenNodesList.forEach(h => {
      const node = this.channelNodes.find(n => n.name === h.name);
      if (node) node.hiddenNum = h.hiddenNum;
    });
    this.computeElkLayout();
  }

  computeElkLayout() {
    const children: any[] = [];
    const edges: any[] = [];
    let edgeId = 0;

    // Business nodes
    this.businesses.forEach((biz, i) => {
      children.push({ id: `biz-${i}`, width: 200, height: 55, type: 'business', data: biz });
    });

    // Line nodes
    this.channelNodes.forEach((line, j) => {
      const w = this.isNetworkNode(line.nodeType) ? 200 : 220;
      const h = this.isNetworkNode(line.nodeType) ? 40 : 55;
      children.push({ id: `line-${j}`, width: w, height: h, type: 'line', data: line });
    });

    // Channel node
    children.push({ id: 'channel', width: 220, height: 80, type: 'channel', data: this.selectedChannel });

    // Org nodes
    this.organizations.forEach(org => {
      children.push({ id: `org-${org.id}`, width: 160, height: 55, type: 'org', data: org });
    });

    // Edges: business → root lines
    this.businesses.forEach((biz, i) => {
      const connected = new Set<string>();
      (biz.nodes || []).forEach(bizLine => {
        const lineIdx = this.channelNodes.findIndex(l => l.name === bizLine.name);
        if (lineIdx >= 0 && this.channelNodes[lineIdx].isRoot && !connected.has(`${lineIdx}`)) {
          connected.add(`${lineIdx}`);
          edges.push({ id: `e${edgeId++}`, sources: [`biz-${i}`], targets: [`line-${lineIdx}`] });
        }
      });
    });

    // Edges: line → line
    this.channelNodes.forEach((line, j) => {
      if (line.isRoot) return;
      (line.sourceEndpoints || []).forEach(sep => {
        if (sep === '.') return;
        const parentIdx = this.channelNodes.findIndex(l => l.name === sep);
        if (parentIdx >= 0) edges.push({ id: `e${edgeId++}`, sources: [`line-${parentIdx}`], targets: [`line-${j}`] });
      });
    });

    // Edges: linkedChannel → channel
    this.channelNodes.forEach((line, j) => {
      if (line.linkedChannel) edges.push({ id: `e${edgeId++}`, sources: [`line-${j}`], targets: ['channel'] });
    });

    // Edges: channel → orgs
    this.organizations.forEach(org => {
      edges.push({ id: `e${edgeId++}`, sources: ['channel'], targets: [`org-${org.id}`] });
    });

    // No lines: business → channel
    if (!this.channelNodes.length) {
      this.businesses.forEach((_, i) => {
        edges.push({ id: `e${edgeId++}`, sources: [`biz-${i}`], targets: ['channel'] });
      });
    }

    const graph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'stress',
        'elk.stress.desiredEdgeLength': '80',
        'elk.spacing.nodeNode': '20',
        'elk.padding': '[top=10,left=10,bottom=10,right=10]',
      },
      children,
      edges,
    };

    this.elk.layout(graph).then(layouted => {
      this.elkNodes = (layouted.children || []).map(n => ({
        id: n.id,
        x: n.x,
        y: n.y,
        width: n.width,
        height: n.height,
        type: children.find(c => c.id === n.id)?.type,
        data: children.find(c => c.id === n.id)?.data,
      }));
      this.elkGraphHeight = 600;

      // Draw elk lines after render
      setTimeout(() => this.drawElkLines(layouted, themeColor), 300);
    });

    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--devui-brand').trim() || '#5e7ce0';
  }

  drawElkLines(layouted: any, themeColor: string) {
    this.elkLines.forEach(l => { try { l.remove(); } catch (e) {} });
    this.elkLines = [];
    const noArrow = { color: themeColor, size: 2, path: 'grid', endPlug: 'behind', startPlug: 'behind' };
    const getEl = (id: string) => this.el.nativeElement.querySelector(`#elk-${id}`);

    (layouted.edges || []).forEach(edge => {
      const srcId = edge.sources?.[0];
      const tgtId = edge.targets?.[0];
      const srcEl = getEl(srcId);
      const tgtEl = getEl(tgtId);
      if (!srcEl || !tgtEl) return;

      // Check if business edge for arrow direction
      const isBizEdge = srcId?.startsWith('biz-');
      let opts: any = noArrow;
      if (isBizEdge) {
        const bizIdx = parseInt(srcId.replace('biz-', ''));
        const biz = this.businesses[bizIdx];
        const isOutbound = biz?.businessDirection === 'OUTBOUND';
        opts = { color: themeColor, size: 2, path: 'grid', endPlug: 'arrow1', startPlug: 'behind' };
        if (!isOutbound) {
          try { this.elkLines.push(new LeaderLine(tgtEl, srcEl, opts)); } catch (e) {}
          return;
        }
      }
      try { this.elkLines.push(new LeaderLine(srcEl, tgtEl, opts)); } catch (e) {}
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
    const lineColor = themeColor.startsWith('#') ? themeColor + 'CC' : themeColor;
    const labelColor = getComputedStyle(document.documentElement).getPropertyValue('--devui-text').trim() || '#252b3a';
    const noArrow = { color: lineColor, size: 2, path: 'fluid', endPlug: 'behind', startPlug: 'behind' };

    // Build line element map by index
    const nodeElMap = new Map<number, HTMLElement>();
    const nodeByName = new Map<string, number>(); // name → index (ALL lines)
    this.channelNodes.forEach((line, j) => {
      nodeByName.set(line.name, j);
      const el = this.el.nativeElement.querySelector(`#node-${j}`);
      if (el) {
        nodeElMap.set(j, el);
      }
    });

    // Identify root lines (sourceEndpoint === ".") and child lines
    const rootLineIndices = new Set<number>();
    const terminalLineIndices = new Set<number>(); // lines that connect to channel (no child points to them)
    const childTargets = new Set<number>(); // lines that are targets of other lines

    this.channelNodes.forEach((line, j) => {
      if (line.isRoot) {
        rootLineIndices.add(j);
      }
    });

    const hiddenTypes = ['LEASED_LINE', 'IPSEC_VPN', 'INTERNET'];

    // Build column map: nodeIdx → column index, row index within column
    const nodeColumnMap = new Map<number, number>();
    const nodeRowMap = new Map<number, number>();
    this.nodeLevels.forEach((level, colIdx) => {
      let row = 0;
      level.forEach(n => {
        const idx = this.channelNodes.findIndex(l => l.name === n.name);
        if (idx >= 0) {
          nodeColumnMap.set(idx, colIdx);
          nodeRowMap.set(idx, row);
          if (!hiddenTypes.includes(n.nodeType)) row++;
        }
      });
    });

    const getSides = (srcIdx: number, tgtIdx: number): [string, string] => {
      const srcCol = nodeColumnMap.get(srcIdx) ?? -1;
      const tgtCol = nodeColumnMap.get(tgtIdx) ?? -1;
      if (srcCol === tgtCol) {
        const srcRow = nodeRowMap.get(srcIdx) ?? 0;
        const tgtRow = nodeRowMap.get(tgtIdx) ?? 0;
        return tgtRow > srcRow ? ['bottom', 'top'] : ['top', 'bottom'];
      }
      return srcCol < tgtCol ? ['right', 'left'] : ['left', 'right'];
    };

    // Two-pass anchor system: collect connections, then draw with distributed anchors
    // Right side points: 1(100%,25%) 2(100%,50%) 3(100%,75%)
    // Left side points:  4(0%,25%)   5(0%,50%)   6(0%,75%)
    const rightPts = [{ x: '100%', y: '25%' }, { x: '100%', y: '50%' }, { x: '100%', y: '75%' }];
    const leftPts  = [{ x: '0%', y: '25%' },   { x: '0%', y: '50%' },  { x: '0%', y: '75%' }];
    const topPts   = [{ x: '25%', y: '0%' },   { x: '50%', y: '0%' },  { x: '75%', y: '0%' }];
    const bottomPts = [{ x: '25%', y: '100%' }, { x: '50%', y: '100%' }, { x: '75%', y: '100%' }];

    // Collect all planned connections: { srcEl, tgtEl, srcSide, tgtSide, opts }
    const planned: { srcEl: HTMLElement; tgtEl: HTMLElement; srcSide: string; tgtSide: string; opts: any }[] = [];
    const addConn = (srcEl: HTMLElement, tgtEl: HTMLElement, srcSide: string, tgtSide: string, opts: any) => {
      planned.push({ srcEl, tgtEl, srcSide, tgtSide, opts });
    };

    // After collecting, distribute anchors per element+side
    const drawPlanned = () => {
      // Count connections per element+side
      const sideCount = new Map<string, number>();
      planned.forEach(c => {
        const sk = `${c.srcEl.id}-${c.srcSide}`;
        const tk = `${c.tgtEl.id}-${c.tgtSide}`;
        sideCount.set(sk, (sideCount.get(sk) || 0) + 1);
        sideCount.set(tk, (sideCount.get(tk) || 0) + 1);
      });
      // Track current index per element+side
      const sideIdx = new Map<string, number>();
      const getPts = (side: string) => side === 'right' ? rightPts : side === 'left' ? leftPts : side === 'top' ? topPts : bottomPts;
      const getPoint = (elId: string, side: string) => {
        const key = `${elId}-${side}`;
        const total = sideCount.get(key) || 1;
        const idx = sideIdx.get(key) || 0;
        sideIdx.set(key, idx + 1);
        const pts = getPts(side);
        // 1 conn → middle(idx 1), 2 conn → top+bottom(idx 0,2), 3 conn → all(idx 0,1,2)
        let ptIdx: number;
        if (total === 1) { ptIdx = 1; }
        else if (total === 2) { ptIdx = idx === 0 ? 0 : 2; }
        else { ptIdx = Math.min(idx, 2); }
        return pts[ptIdx];
      };

      const gravityMap: { [s: string]: number[] } = { right: [20, 0], left: [-20, 0], top: [0, -20], bottom: [0, 20] };
      planned.forEach(c => {
        const sp = getPoint(c.srcEl.id, c.srcSide);
        const tp = getPoint(c.tgtEl.id, c.tgtSide);
        const start = LeaderLine.pointAnchor(c.srcEl, { x: sp.x, y: sp.y });
        const end = LeaderLine.pointAnchor(c.tgtEl, { x: tp.x, y: tp.y });
        try { this.lines.push(new LeaderLine(start, end, { ...c.opts, startSocketGravity: gravityMap[c.srcSide], endSocketGravity: gravityMap[c.tgtSide] })); } catch (e) {}
      });
    };

    // Business → root lines (skip hidden, connect to visible descendants with label)
    const bizConnected = new Set<string>();

    // Helper: find visible descendants of a hidden line
    const findVisibleDescendants = (lineName: string): { idx: number; el: HTMLElement }[] => {
      const results: { idx: number; el: HTMLElement }[] = [];
      this.channelNodes.forEach((cl, idx) => {
        if ((cl.sourceEndpoints || []).includes(lineName)) {
          if (!hiddenTypes.includes(cl.nodeType)) {
            const el = nodeElMap.get(idx);
            if (el) results.push({ idx, el });
          } else {
            results.push(...findVisibleDescendants(cl.name));
          }
        }
      });
      return results;
    };

    // Business → root nodes: pre-count connections per target node, then draw with fixed anchors
    // Biz always uses right-middle (2号). Node left side: 1 biz→5号(middle), multi→4号(top) then 6号(bottom)
    const bizTargetCount = new Map<string, number>(); // targetElId → count
    const bizConns: { bizEl: HTMLElement; tgtEl: HTMLElement; opts: any; isOutbound: boolean }[] = [];

    this.businesses.forEach((biz, i) => {
      const bizEl = this.el.nativeElement.querySelector(`#biz-${i}`);
      if (!bizEl) return;
      (biz.nodes || []).forEach(bizLine => {
        const lineIdx = this.channelNodes.findIndex(l => l.name === bizLine.name);
        if (lineIdx < 0) return;
        const mergedLine = this.channelNodes[lineIdx];
        if (!mergedLine.isRoot) return;
        const isOutbound = biz.businessDirection === 'OUTBOUND';

        const targets: { el: HTMLElement; label?: any; dash?: boolean }[] = [];
        if (hiddenTypes.includes(mergedLine.nodeType)) {
          findVisibleDescendants(mergedLine.name).forEach(d => {
            const key = `${i}-${d.idx}`;
            if (bizConnected.has(key)) return;
            bizConnected.add(key);
            targets.push({ el: d.el,
              label: LeaderLine.captionLabel(this.getHiddenLabel(mergedLine.name), {color: labelColor, outlineColor: '', fontSize: '9px'}),
              dash: this.isDashedType(mergedLine.nodeType) });
          });
        } else {
          const key = `${i}-${mergedLine.name}`;
          if (!bizConnected.has(key)) {
            bizConnected.add(key);
            const lineEl = nodeElMap.get(lineIdx);
            if (lineEl) targets.push({ el: lineEl });
          }
        }

        targets.forEach(t => {
          bizTargetCount.set(t.el.id, (bizTargetCount.get(t.el.id) || 0) + 1);
          const opts: any = { color: lineColor, size: 2, path: 'fluid', startPlug: 'behind', endPlug: 'arrow1' };
          if (t.label) opts.middleLabel = t.label;
          if (t.dash) opts.dash = true;
          bizConns.push({ bizEl, tgtEl: t.el, opts, isOutbound });
        });
      });
    });

    // Draw business connections with fixed anchors
    // Node left-side anchor points for receiving biz connections:
    // 0=left-mid, 1=left-top, 2=top-left, 3=top-mid, 4=top-right,
    // 5=left-bottom, 6=bottom-left, 7=bottom-mid, 8=bottom-right
    const nodeAnchorPts = [
      { pt: { x: '0%', y: '50%' },   g: [-20, 0] },  // 0
      { pt: { x: '0%', y: '25%' },   g: [-20, 0] },  // 1
      { pt: { x: '25%', y: '0%' },   g: [0, -20] },  // 2
      { pt: { x: '50%', y: '0%' },   g: [0, -20] },  // 3
      { pt: { x: '75%', y: '0%' },   g: [0, -20] },  // 4
      { pt: { x: '0%', y: '75%' },   g: [-20, 0] },  // 5
      { pt: { x: '25%', y: '100%' }, g: [0, 20] },   // 6
      { pt: { x: '50%', y: '100%' }, g: [0, 20] },   // 7
      { pt: { x: '75%', y: '100%' }, g: [0, 20] },   // 8
    ];
    const bizRightMid = { x: '100%', y: '50%' };
    const bizRightPts = [{ x: '100%', y: '25%' }, { x: '100%', y: '50%' }, { x: '100%', y: '75%' }];
    const bizSourceCount = new Map<string, number>();
    bizConns.forEach(c => { bizSourceCount.set(c.bizEl.id, (bizSourceCount.get(c.bizEl.id) || 0) + 1); });
    const bizSourceIdx = new Map<string, number>();
    const bizTargetIdx = new Map<string, number>();
    const pick3 = (total: number, idx: number) => {
      if (total === 1) return 1;
      if (total === 2) return idx === 0 ? 0 : 2;
      return Math.min(idx, 2);
    };
    // Upper sequence: 1→3, 2→4,2, 3+→4,3,2,1 (cycle)
    const upperSeq = [4, 3, 2, 1];
    // Lower sequence (assigned from max seq to min): 1→7, 2→8,7, 3+→8,7,6,5 (cycle)
    const lowerSeq = [8, 7, 6, 5];
    const getNodeAnchorIdx = (tgtTotal: number, tgtIdx: number): number => {
      if (tgtTotal === 1) return 0;
      const half = Math.ceil(tgtTotal / 2);
      if (tgtIdx < half) {
        // Upper half (first half, normal order)
        if (half === 1) return 3;
        if (half === 2) return [4, 2][tgtIdx];
        return upperSeq[tgtIdx % upperSeq.length];
      } else {
        // Lower half (reverse: last biz gets 8, then 7, 6, 5)
        const lowerCount = tgtTotal - half;
        const li = (tgtTotal - 1 - tgtIdx); // reverse index within lower half
        if (lowerCount === 1) return 7;
        if (lowerCount === 2) return [8, 7][li];
        return lowerSeq[li % lowerSeq.length];
      }
    };
    bizConns.forEach((c) => {
      // Biz right side: 1→2号, 2→1+3号, 3→1+2+3号
      const bTotal = bizSourceCount.get(c.bizEl.id) || 1;
      const bIdx = bizSourceIdx.get(c.bizEl.id) || 0;
      bizSourceIdx.set(c.bizEl.id, bIdx + 1);
      const bizPt = bizRightPts[pick3(bTotal, bIdx)];

      const tgtTotal = bizTargetCount.get(c.tgtEl.id) || 1;
      const tgtIdx = bizTargetIdx.get(c.tgtEl.id) || 0;
      bizTargetIdx.set(c.tgtEl.id, tgtIdx + 1);

      const naPt = nodeAnchorPts[getNodeAnchorIdx(tgtTotal, tgtIdx)];

      const bizAnchor = LeaderLine.pointAnchor(c.bizEl, bizPt);
      const nodeAnchor = LeaderLine.pointAnchor(c.tgtEl, naPt.pt);
      try {
        if (c.isOutbound) {
          this.lines.push(new LeaderLine(bizAnchor, nodeAnchor, { ...c.opts, startSocketGravity: [20, 0], endSocketGravity: naPt.g }));
        } else {
          this.lines.push(new LeaderLine(nodeAnchor, bizAnchor, { ...c.opts, startSocketGravity: naPt.g, endSocketGravity: [20, 0] }));
        }
      } catch (e) {}
    });

    // Line → Line: for each visible line, connect to all visible parents in sourceEndpoints
    // Line → Line
    this.channelNodes.forEach((line, j) => {
      if (line.isRoot) return;
      if (hiddenTypes.includes(line.nodeType)) return;
      const childEl = nodeElMap.get(j);
      if (!childEl) return;
      (line.sourceEndpoints || []).forEach(sep => {
        if (sep === '.') return;
        const parentIdx = nodeByName.get(sep);
        if (parentIdx === undefined) return;
        const parentLine = this.channelNodes[parentIdx];
        if (hiddenTypes.includes(parentLine.nodeType)) {
          (parentLine.sourceEndpoints || []).forEach(gSep => {
            if (gSep === '.') return;
            const gIdx = nodeByName.get(gSep);
            if (gIdx === undefined) return;
            const gEl = nodeElMap.get(gIdx);
            if (!gEl) return;
            const [gs, gt] = getSides(gIdx, j);
            addConn(gEl, childEl, gs, gt, { ...noArrow, dash: this.isDashedType(parentLine.nodeType), middleLabel: LeaderLine.captionLabel(this.getHiddenLabel(parentLine.name), {color: labelColor, outlineColor: '', fontSize: '9px'}) });
          });
        } else {
          const parentEl = nodeElMap.get(parentIdx);
          if (!parentEl) return;
          const [ps, pt] = getSides(parentIdx, j);
          addConn(parentEl, childEl, ps, pt, noArrow);
        }
      });
    });

    // Hidden lines with linkedChannel → connect their parents to channel with label
    this.channelNodes.forEach((line, j) => {
      if (!line.linkedChannel) return;
      if (hiddenTypes.includes(line.nodeType)) {
        (line.sourceEndpoints || []).forEach(sep => {
          if (sep === '.') return;
          const parentIdx = nodeByName.get(sep);
          if (parentIdx === undefined) return;
          const parentEl = nodeElMap.get(parentIdx);
          if (!parentEl) return;
          const label = { middleLabel: LeaderLine.captionLabel(this.getHiddenLabel(line.name), {color: labelColor, outlineColor: '', fontSize: '9px'}), dash: this.isDashedType(line.nodeType) };
          addConn(parentEl, centerEl, 'right', 'left', { ...noArrow, ...label });
        });
      } else {
        const lineEl = nodeElMap.get(j);
        if (!lineEl) return;
        const nodeType = line.nodeType;
        const label = (nodeType === 'LEASED_LINE' || nodeType === 'IPSEC_VPN') ? { middleLabel: LeaderLine.captionLabel(this.getHiddenLabel(line.name), { color: labelColor, outlineColor: '', fontSize: '9px' }) } : {};
        addConn(lineEl, centerEl, 'right', 'left', { ...noArrow, ...label });
      }
    });

    // If no lines, Business → Channel directly
    if (!this.channelNodes.length) {
      this.businesses.forEach((_, i) => {
        const bizEl = this.el.nativeElement.querySelector(`#biz-${i}`);
        if (!bizEl) return;
        addConn(bizEl, centerEl, 'right', 'left', noArrow);
      });
    }

    // Channel → Organization with distributed anchors
    // Channel card anchors: u1-u5 (top), r1-r5 (right), d1-d5 (bottom)
    const chUp = [
      { pt: { x: '17%', y: '0%' }, g: [0, -20] },  // u1
      { pt: { x: '33%', y: '0%' }, g: [0, -20] },  // u2
      { pt: { x: '50%', y: '0%' }, g: [0, -20] },  // u3
      { pt: { x: '67%', y: '0%' }, g: [0, -20] },  // u4
      { pt: { x: '83%', y: '0%' }, g: [0, -20] },  // u5
    ];
    const chRight = [
      { pt: { x: '100%', y: '10%' }, g: [20, 0] },  // r1
      { pt: { x: '100%', y: '30%' }, g: [20, 0] },  // r2
      { pt: { x: '100%', y: '50%' }, g: [20, 0] },  // r3
      { pt: { x: '100%', y: '70%' }, g: [20, 0] },  // r4
      { pt: { x: '100%', y: '90%' }, g: [20, 0] },  // r5
    ];
    const chDown = [
      { pt: { x: '17%', y: '100%' }, g: [0, 20] },  // d1
      { pt: { x: '33%', y: '100%' }, g: [0, 20] },  // d2
      { pt: { x: '50%', y: '100%' }, g: [0, 20] },  // d3
      { pt: { x: '67%', y: '100%' }, g: [0, 20] },  // d4
      { pt: { x: '83%', y: '100%' }, g: [0, 20] },  // d5
    ];
    // Upper extended sequence: u1,u2,u3,u4,u5,r1,r2 (cycle)
    const chUpperSeq = [...chUp, chRight[0], chRight[1]];
    // Lower extended sequence: d1,d2,d3,d4,d5,r4,r5 (cycle, reversed assignment)
    const chLowerSeq = [...chDown, chRight[3], chRight[4]];

    const orgCount = this.organizations.length;
    const orgEls: { el: HTMLElement; org: any }[] = [];
    this.organizations.forEach(org => {
      const orgEl = this.el.nativeElement.querySelector(`#org-${org.id}`);
      if (orgEl) orgEls.push({ el: orgEl, org });
    });

    const getChAnchor = (total: number, idx: number) => {
      if (total === 1) return chRight[2]; // r3
      const half = Math.ceil(total / 2);
      if (idx < half) {
        // Upper half
        if (half === 1) return chRight[1]; // r2
        if (half === 2) return [chRight[0], chRight[1]][idx]; // r1, r2
        // 3+: u1,u2,u3,u4,u5,r1,r2 cycle
        return chUpperSeq[idx % chUpperSeq.length];
      } else {
        // Lower half (reverse: from bottom up)
        const lowerCount = total - half;
        const li = (total - 1 - idx); // reverse index
        if (lowerCount === 1) return chRight[3]; // r4
        if (lowerCount === 2) return [chRight[4], chRight[3]][li]; // r5, r4
        // 3+: d1,d2,d3,d4,d5,r5,r4 cycle (from bottom up)
        return chLowerSeq[li % chLowerSeq.length];
      }
    };

    orgEls.forEach((o, i) => {
      const chA = getChAnchor(orgEls.length, i);
      const chAnchor = LeaderLine.pointAnchor(centerEl, chA.pt);
      const orgAnchor = LeaderLine.pointAnchor(o.el, { x: '0%', y: '50%' });
      try {
        this.lines.push(new LeaderLine(chAnchor, orgAnchor, { ...noArrow, startSocketGravity: chA.g, endSocketGravity: [-20, 0] }));
      } catch (e) {}
    });

    // Draw all planned connections with distributed anchors
    drawPlanned();

    // Force leader-line SVGs to top layer
    setTimeout(() => {
      document.querySelectorAll('body > .leader-line').forEach((svg: any) => {
        svg.style.zIndex = '10000';
      });
    }, 100);
  }
}
