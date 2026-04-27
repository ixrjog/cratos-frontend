import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { DataTableComponent, DialogService } from 'ng-devui';
import { HttpResult, Table, TABLE_DATA } from '../../../../../@core/data/base-data';
import { ADD_OPERATION, DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../../@shared/utils/dialog.util';
import { TOAST_CONTENT, ToastUtil } from '../../../../../@shared/utils/toast.util';
import { getRowColor, onFetchValidData } from '../../../../../@shared/utils/data-table.utli';
import { Observable, zip } from 'rxjs';
import { ChannelNodeEdit, ChannelNodePageQuery, ChannelNodeVO } from '../../../../../@core/data/channel-line';
import { ChannelNodeService } from '../../../../../@core/services/channel-line.service';
import { ChannelInfoService } from '../../../../../@core/services/channel-info.service';
import { ChannelNodeEditorComponent } from './channel-line-editor/channel-line-editor.component';

declare var LeaderLine: any;

@Component({
  selector: 'app-channel-line-list-data-table',
  templateUrl: './channel-line-list-data-table.component.html',
  styleUrls: ['./channel-line-list-data-table.component.less'],
})
export class ChannelNodeListDataTableComponent implements OnInit, OnDestroy, AfterViewChecked {

  static readonly COUNTRY_STORAGE_KEY = 'channel_node_country';
  static readonly CHANNEL_STORAGE_KEY = 'channel_node_channel';

  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  queryParam = {
    queryName: '',
    channelId: null as number,
  };
  table: Table<ChannelNodeVO> = JSON.parse(JSON.stringify(TABLE_DATA));
  channelOptions: { label: string; value: number; country: string }[] = [];
  filteredChannelOptions: { label: string; value: number; country: string }[] = [];
  selectedChannel: any = null;
  selectedCountry = '';
  countryOptions = ['CN', 'NG', 'TZ', 'BD', 'PK', 'GH', 'UG', 'PH', 'ZA', 'KE', 'BF', 'IQ'];

  // Graph
  allLines: any[] = [];
  lineLevels: any[][] = [];
  hiddenNodesList: any[] = [];
  leaderLines: any[] = [];
  needDrawLines = false;
  private positionInterval: any;

  newChannelNode: ChannelNodeEdit = {
    channelId: null,
    name: '',
    nodeType: '',
    sourceEndpoint: '',
    monitorUrl: '',
    linkedChannel: false,
    valid: true,
    comment: '',
    nodeInfo: '',
  };

  dialogDate = {
    editorData: { ...DIALOG_DATA.editorData, width: '600px', content: ChannelNodeEditorComponent },
    warningOperateData: { ...DIALOG_DATA.warningOperateData },
    content: { ...DIALOG_DATA.content },
  };

  constructor(
    private channelNodeService: ChannelNodeService,
    private channelInfoService: ChannelInfoService,
    private dialogUtil: DialogUtil,
    private dialogService: DialogService,
    private toastUtil: ToastUtil,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    this.fetchChannels();
    this.positionInterval = setInterval(() => {
      this.leaderLines.forEach(l => { try { l.position(); } catch (e) {} });
    }, 500);
  }

  ngOnDestroy() {
    this.removeLines();
    if (this.positionInterval) clearInterval(this.positionInterval);
  }

  ngAfterViewChecked() {
    if (this.needDrawLines) {
      this.needDrawLines = false;
      setTimeout(() => {
        this.drawLines();
        setTimeout(() => this.leaderLines.forEach(l => { try { l.position(); } catch (e) {} }), 300);
      }, 300);
    }
  }

  fetchData() {
    const param: ChannelNodePageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.channelNodeService.queryChannelNodePage(param));
    this.fetchAllLines();
  }

  fetchAllLines() {
    if (!this.queryParam.channelId) return;
    this.channelNodeService.queryChannelNodePage({
      queryName: '', channelId: this.queryParam.channelId, page: 1, length: 200,
    }).subscribe(({ body }) => {
      this.allLines = body.data || [];
      this.computeLineLevels();
      this.needDrawLines = true;
    });
  }

  computeLineLevels() {
    this.lineLevels = [];
    if (!this.allLines.length) return;
    const mergedMap = new Map<string, any>();
    this.allLines.forEach(l => {
      if (mergedMap.has(l.name)) {
        mergedMap.get(l.name).mergedIds.push(l.id);
        if (!mergedMap.get(l.name).sourceEndpoints.includes(l.sourceEndpoint)) {
          mergedMap.get(l.name).sourceEndpoints.push(l.sourceEndpoint);
        }
      } else {
        mergedMap.set(l.name, { ...l, mergedIds: [l.id], sourceEndpoints: [l.sourceEndpoint] });
      }
    });
    const mergedLines = Array.from(mergedMap.values());
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
    this.allLines = mergedLines;

    // Assign numbers to hidden nodes
    const hiddenTypes = ['LEASED_LINE', 'IPSEC_VPN', 'INTERNET'];
    let num = 1;
    this.hiddenNodesList = mergedLines
      .filter(l => hiddenTypes.includes(l.nodeType))
      .map(l => ({ ...l, hiddenNum: num++ }));
    this.hiddenNodesList.forEach(h => {
      const node = this.allLines.find(n => n.name === h.name);
      if (node) node.hiddenNum = h.hiddenNum;
    });
  }

  getLineIndex(line: any): number {
    return this.allLines.findIndex(l => l.name === line.name);
  }

  removeLines() {
    this.leaderLines.forEach(l => { try { l.remove(); } catch (e) {} });
    this.leaderLines = [];
  }

  getHiddenLabel(nodeName: string): string {
    const node = this.hiddenNodesList.find(n => n.name === nodeName);
    return node ? `#${node.hiddenNum} ${node.nodeType}` : '';
  }

  isDashedType(nodeType: string): boolean {
    return nodeType === 'IPSEC_VPN' || nodeType === 'INTERNET';
  }

  drawLines() {
    this.removeLines();
    if (!this.allLines.length) return;
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--devui-brand').trim() || '#5e7ce0';
    const lineColor = themeColor.startsWith('#') ? themeColor + 'CC' : themeColor;
    const noArrow = { color: lineColor, size: 2, path: 'fluid', startSocket: 'right', endSocket: 'left', endPlug: 'behind', startPlug: 'behind' };
    const hiddenTypes = ['LEASED_LINE', 'IPSEC_VPN', 'INTERNET'];

    const lineElMap = new Map<number, HTMLElement>();
    const lineByName = new Map<string, number>();
    this.allLines.forEach((line, j) => {
      lineByName.set(line.name, j);
      const el = this.el.nativeElement.querySelector(`#graph-line-${j}`);
      if (el) lineElMap.set(j, el);
    });

    // Column map for same-column detection
    const nodeColumnMap = new Map<number, number>();
    this.lineLevels.forEach((level, colIdx) => {
      level.forEach(line => {
        const idx = this.allLines.findIndex(l => l.name === line.name);
        if (idx >= 0) nodeColumnMap.set(idx, colIdx);
      });
    });
    const isSameColumn = (a: number, b: number) =>
      nodeColumnMap.has(a) && nodeColumnMap.has(b) && nodeColumnMap.get(a) === nodeColumnMap.get(b);

    // Socket distribution
    const pairCount = new Map<string, number>();
    const getSocketPair = (key: string, sameCol = false) => {
      const c = pairCount.get(key) || 0;
      pairCount.set(key, c + 1);
      if (sameCol) {
        if (c === 0) return { startSocket: 'bottom', endSocket: 'top', path: 'magnet', startSocketGravity: 20, endSocketGravity: 20 };
        if (c === 1) return { startSocket: 'right', endSocket: 'right', path: 'magnet', startSocketGravity: 20, endSocketGravity: 20 };
        return { startSocket: 'left', endSocket: 'left', path: 'magnet', startSocketGravity: 20, endSocketGravity: 20 };
      }
      if (c === 0) return { startSocket: 'right', endSocket: 'left' };
      if (c === 1) return { startSocket: 'top', endSocket: 'top', path: 'magnet', startSocketGravity: 20, endSocketGravity: 20 };
      return { startSocket: 'bottom', endSocket: 'bottom', path: 'magnet', startSocketGravity: 20, endSocketGravity: 20 };
    };

    // Line → Line (skip hidden, draw through with label)
    this.allLines.forEach((line, j) => {
      if (line.isRoot) return;
      if (hiddenTypes.includes(line.nodeType)) return;
      const childEl = lineElMap.get(j);
      if (!childEl) return;
      (line.sourceEndpoints || []).forEach(sep => {
        if (sep === '.') return;
        const parentIdx = lineByName.get(sep);
        if (parentIdx === undefined) return;
        const parentLine = this.allLines[parentIdx];
        if (hiddenTypes.includes(parentLine.nodeType)) {
          // Hidden parent: connect grandparents to this child with label
          (parentLine.sourceEndpoints || []).forEach(gSep => {
            if (gSep === '.') return;
            const gIdx = lineByName.get(gSep);
            if (gIdx === undefined) return;
            const gEl = lineElMap.get(gIdx);
            if (!gEl) return;
            const pk = `${gIdx}-${j}`;
            const sockets = getSocketPair(pk, isSameColumn(gIdx, j));
            try {
              this.leaderLines.push(new LeaderLine(gEl, childEl, { ...noArrow, ...sockets,
                dash: this.isDashedType(parentLine.nodeType),
                middleLabel: LeaderLine.captionLabel(this.getHiddenLabel(parentLine.name), {color: '#fff', outlineColor: '', fontSize: '9px'})
              }));
            } catch (e) {}
          });
        } else {
          const parentEl = lineElMap.get(parentIdx);
          if (!parentEl) return;
          const pk = `${parentIdx}-${j}`;
          const sockets = getSocketPair(pk, isSameColumn(parentIdx, j));
          try { this.leaderLines.push(new LeaderLine(parentEl, childEl, { ...noArrow, ...sockets })); } catch (e) {}
        }
      });
    });

    // LinkedChannel → Channel card
    const channelEl = this.el.nativeElement.querySelector('#graph-channel-card');
    if (channelEl) {
      this.allLines.forEach((line, j) => {
        if (!line.linkedChannel) return;
        if (hiddenTypes.includes(line.nodeType)) {
          // Hidden: connect parents to channel with label
          (line.sourceEndpoints || []).forEach(sep => {
            if (sep === '.') return;
            const pIdx = lineByName.get(sep);
            if (pIdx === undefined) return;
            const pEl = lineElMap.get(pIdx);
            if (!pEl) return;
            const sockets = getSocketPair(`${pIdx}-channel`);
            try {
              this.leaderLines.push(new LeaderLine(pEl, channelEl, { ...noArrow, ...sockets,
                dash: this.isDashedType(line.nodeType),
                middleLabel: LeaderLine.captionLabel(this.getHiddenLabel(line.name), {color: '#fff', outlineColor: '', fontSize: '9px'})
              }));
            } catch (e) {}
          });
        } else {
          const lineEl = lineElMap.get(j);
          if (!lineEl) return;
          const sockets = getSocketPair(`${j}-channel`);
          try { this.leaderLines.push(new LeaderLine(lineEl, channelEl, { ...noArrow, ...sockets })); } catch (e) {}
        }
      });
    }
  }

  fetchChannels() {
    this.channelInfoService.queryChannelPage({ queryName: '', page: 1, length: 200 })
      .subscribe(({ body }) => {
        this.channelOptions = (body.data || []).map(c => ({ label: c.name, value: c.id, country: c.country }));
        // Restore saved state
        const savedCountry = localStorage.getItem(ChannelNodeListDataTableComponent.COUNTRY_STORAGE_KEY) || '';
        const savedChannel = localStorage.getItem(ChannelNodeListDataTableComponent.CHANNEL_STORAGE_KEY);
        this.selectedCountry = savedCountry;
        this.filterChannelOptions();
        if (savedChannel) {
          try {
            const ch = JSON.parse(savedChannel);
            const match = this.filteredChannelOptions.find(o => o.value === ch.value);
            if (match) {
              this.selectedChannel = match;
              this.queryParam.channelId = match.value;
              this.fetchData();
            }
          } catch (e) {}
        }
      });
  }

  onCountryChange(cc: any) {
    this.selectedCountry = cc as string;
    localStorage.setItem(ChannelNodeListDataTableComponent.COUNTRY_STORAGE_KEY, this.selectedCountry);
    this.selectedChannel = null;
    localStorage.removeItem(ChannelNodeListDataTableComponent.CHANNEL_STORAGE_KEY);
    this.filterChannelOptions();
  }

  filterChannelOptions() {
    this.filteredChannelOptions = this.selectedCountry
      ? this.channelOptions.filter(c => c.country === this.selectedCountry)
      : this.channelOptions;
  }

  onChannelChange(selected: any) {
    this.queryParam.channelId = selected?.value || null;
    if (selected) {
      localStorage.setItem(ChannelNodeListDataTableComponent.CHANNEL_STORAGE_KEY, JSON.stringify(selected));
    } else {
      localStorage.removeItem(ChannelNodeListDataTableComponent.CHANNEL_STORAGE_KEY);
    }
    this.removeLines();
    this.lineLevels = [];
    if (this.queryParam.channelId) this.fetchData();
  }

  pageIndexChange(p) { this.table.pager.pageIndex = p; this.fetchData(); }
  pageSizeChange(s) { this.table.pager.pageSize = s; this.fetchData(); }

  onRowNew() {
    const newData = JSON.parse(JSON.stringify(this.newChannelNode));
    if (this.selectedChannel) {
      newData.channelId = this.selectedChannel.value;
      newData.channelName = this.selectedChannel.label;
    }
    this.dialogUtil.onEditDialog(ADD_OPERATION, { ...this.dialogDate.editorData, title: 'New Channel Line' }, () => this.fetchData(), newData);
  }

  onRowEdit(rowItem: ChannelNodeVO) {
    this.dialogUtil.onEditDialog(UPDATE_OPERATION, { ...this.dialogDate.editorData, title: 'Edit Channel Line' }, () => this.fetchData(), rowItem);
  }

  onRowValid(rowItem: ChannelNodeVO) {
    this.channelNodeService.setChannelNodeValidById({ id: rowItem.id }).subscribe(() => this.fetchData());
  }

  onRowDelete(rowItem: ChannelNodeVO) {
    this.dialogUtil.onDialog({ ...this.dialogDate.warningOperateData, content: this.dialogDate.content.delete }, () => {
      this.channelNodeService.deleteChannelNodeById({ id: rowItem.id }).subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
        this.fetchData();
      });
    });
  }

  onBatchDelete() {
    this.dialogUtil.onDialog({ ...this.dialogDate.warningOperateData, content: this.dialogDate.content.batchDelete }, () => {
      let obList: Observable<HttpResult<Boolean>>[] = [];
      this.datatable.getCheckedRows().map(row => obList.push(this.channelNodeService.deleteChannelNodeById({ id: row.id })));
      zip(obList).subscribe(() => { this.toastUtil.onSuccessToast(TOAST_CONTENT.BATCH_DELETE); this.fetchData(); });
    });
  }

  @ViewChild('nodeInfoTemplate') nodeInfoTemplate: TemplateRef<any>;
  nodeInfoContent = '';

  onShowNodeInfo(rowItem: ChannelNodeVO) {
    this.nodeInfoContent = (rowItem.nodeInfo || '').replace(/<br\s*\/?>/gi, '\n\n');
    this.dialogService.open({
      id: 'node-info-dialog',
      width: '60%',
      maxHeight: '800px',
      backdropCloseable: true,
      dialogtype: 'standard',
      title: rowItem.name + ' - Node Info',
      contentTemplate: this.nodeInfoTemplate,
      buttons: [],
    });
  }

  protected readonly getRowColor = getRowColor;

  isNetworkLine(nodeType: string): boolean {
    return ['LEASED_LINE', 'IPSEC_VPN', 'INTERNET'].includes(nodeType);
  }
}
