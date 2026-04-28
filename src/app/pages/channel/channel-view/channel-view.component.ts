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
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../@shared/utils/dialog.util';
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
    this.elkLines.forEach(l => { try { l.remove(); } catch (e) {} });
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
    this.elkLines.forEach(l => { try { l.remove(); } catch (e) {} });
    this.elkNodes = [];
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

    this.channelNodeService.queryChannelNodePage({
      queryName: '',
      channelId: this.selectedChannel.id,
      page: 1,
      length: 100,
    }).subscribe(({ body }) => {
      this.channelNodes = body.data || [];
      this.computeLineLevels();
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
      ...DIALOG_DATA.editorData, title: 'Edit Line', content: ChannelNodeEditorComponent,
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
    const noArrow = { color: themeColor, size: 2, path: 'fluid', endPlug: 'behind', startPlug: 'behind' };
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
        opts = { color: themeColor, size: 2, path: 'fluid', endPlug: 'arrow1', startPlug: 'behind' };
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
    const noArrow = { color: lineColor, size: 2, path: 'fluid', startSocket: 'right', endSocket: 'left', endPlug: 'behind', startPlug: 'behind' };

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
    const isSameColumn = (idx1: number, idx2: number) => {
      return nodeColumnMap.has(idx1) && nodeColumnMap.has(idx2) && nodeColumnMap.get(idx1) === nodeColumnMap.get(idx2);
    };

    // Shared connection counter for socket distribution
    const pairCount = new Map<string, number>();
    const getSocketPair = (pairKey: string, sameColumn = false, srcIdx = -1, tgtIdx = -1) => {
      const count = pairCount.get(pairKey) || 0;
      pairCount.set(pairKey, count + 1);
      if (sameColumn) {
        if (count === 0) return { startSocket: 'bottom', endSocket: 'top', path: 'magnet', startSocketGravity: 20, endSocketGravity: 20 };
        if (count === 1) return { startSocket: 'right', endSocket: 'right', path: 'magnet', startSocketGravity: 20, endSocketGravity: 20 };
        return { startSocket: 'left', endSocket: 'left', path: 'magnet', startSocketGravity: 20, endSocketGravity: 20 };
      }
      if (count === 0) return { startSocket: 'right', endSocket: 'left' };
      const srcRow = nodeRowMap.get(srcIdx) ?? 0;
      const tgtRow = nodeRowMap.get(tgtIdx) ?? 0;
      const vert = tgtRow >= srcRow ? 'bottom' : 'top';
      return { startSocket: vert, endSocket: vert, path: 'magnet', startSocketGravity: 20, endSocketGravity: 20 };
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

    this.businesses.forEach((biz, i) => {
      const bizEl = this.el.nativeElement.querySelector(`#biz-${i}`);
      if (!bizEl) return;
      (biz.nodes || []).forEach(bizLine => {
        const lineIdx = this.channelNodes.findIndex(l => l.name === bizLine.name);
        if (lineIdx < 0) return;
        const mergedLine = this.channelNodes[lineIdx];
        if (!mergedLine.isRoot) return;
        const isOutbound = biz.businessDirection === 'OUTBOUND';

        if (hiddenTypes.includes(mergedLine.nodeType)) {
          // Hidden root: connect business to visible descendants with label
          const descendants = findVisibleDescendants(mergedLine.name);
          descendants.forEach(d => {
            const key = `${i}-${d.idx}`;
            if (bizConnected.has(key)) return;
            bizConnected.add(key);
            try {
              this.lines.push(new LeaderLine(bizEl, d.el,
                { color: lineColor, size: 2, path: 'fluid', startSocket: 'right', endSocket: 'left',
                  startPlug: isOutbound ? 'behind' : 'arrow1', endPlug: isOutbound ? 'arrow1' : 'behind',
                  middleLabel: LeaderLine.captionLabel(this.getHiddenLabel(mergedLine.name), {color: labelColor, outlineColor: '', fontSize: '9px'}),
                  dash: this.isDashedType(mergedLine.nodeType) }
              ));
            } catch (e) {}
          });
        } else {
          const key = `${i}-${mergedLine.name}`;
          if (bizConnected.has(key)) return;
          bizConnected.add(key);
          const lineEl = nodeElMap.get(lineIdx);
          if (!lineEl) return;
          try {
            this.lines.push(new LeaderLine(bizEl, lineEl,
              { color: lineColor, size: 2, path: 'fluid', startSocket: 'right', endSocket: 'left',
                startPlug: isOutbound ? 'behind' : 'arrow1', endPlug: isOutbound ? 'arrow1' : 'behind' }
            ));
          } catch (e) {}
        }
      });
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
            const pairKey = `${gIdx}-${j}`;
            const sockets = getSocketPair(pairKey, isSameColumn(gIdx, j), gIdx, j);
            try { this.lines.push(new LeaderLine(gEl, childEl, { ...noArrow, ...sockets, dash: this.isDashedType(parentLine.nodeType), middleLabel: LeaderLine.captionLabel(this.getHiddenLabel(parentLine.name), {color: labelColor, outlineColor: '', fontSize: '9px'}) })); } catch (e) {}
          });
        } else {
          const parentEl = nodeElMap.get(parentIdx);
          if (!parentEl) return;
          const pairKey = `${parentIdx}-${j}`;
          const sockets = getSocketPair(pairKey, isSameColumn(parentIdx, j), parentIdx, j);
          try { this.lines.push(new LeaderLine(parentEl, childEl, { ...noArrow, ...sockets })); } catch (e) {}
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
          const sockets = getSocketPair(`${parentIdx}-channel`);
          try { this.lines.push(new LeaderLine(parentEl, centerEl, { ...noArrow, ...sockets, ...label })); } catch (e) {}
        });
      } else {
        const lineEl = nodeElMap.get(j);
        if (!lineEl) return;
        const nodeType = line.nodeType;
        const label = (nodeType === 'LEASED_LINE' || nodeType === 'IPSEC_VPN') ? { middleLabel: LeaderLine.captionLabel(this.getHiddenLabel(line.name), { color: labelColor, outlineColor: '', fontSize: '9px' }) } : {};
        const sockets = getSocketPair(`${j}-channel`);
        try { this.lines.push(new LeaderLine(lineEl, centerEl, { ...noArrow, ...sockets, ...label })); } catch (e) {}
      }
    });

    // If no lines, Business → Channel directly
    if (!this.channelNodes.length) {
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
      const sockets = getSocketPair(`channel-org-${org.id}`);
      try { this.lines.push(new LeaderLine(centerEl, orgEl, { ...noArrow, ...sockets })); } catch (e) {}
    });

    // Force leader-line SVGs to top layer
    setTimeout(() => {
      document.querySelectorAll('body > .leader-line').forEach((svg: any) => {
        svg.style.zIndex = '10000';
      });
    }, 100);
  }
}
