import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { DataTableComponent } from 'ng-devui';
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
  };

  dialogDate = {
    editorData: { ...DIALOG_DATA.editorData, content: ChannelNodeEditorComponent },
    warningOperateData: { ...DIALOG_DATA.warningOperateData },
    content: { ...DIALOG_DATA.content },
  };

  constructor(
    private channelNodeService: ChannelNodeService,
    private channelInfoService: ChannelInfoService,
    private dialogUtil: DialogUtil,
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
  }

  getLineIndex(line: any): number {
    return this.allLines.findIndex(l => l.name === line.name);
  }

  removeLines() {
    this.leaderLines.forEach(l => { try { l.remove(); } catch (e) {} });
    this.leaderLines = [];
  }

  drawLines() {
    this.removeLines();
    if (!this.allLines.length) return;
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--devui-brand').trim() || '#5e7ce0';
    const noArrow = { color: themeColor, size: 2, path: 'straight', startSocket: 'right', endSocket: 'left', endPlug: 'behind', startPlug: 'behind' };

    const lineElMap = new Map<number, HTMLElement>();
    const lineByName = new Map<string, number>();
    this.allLines.forEach((line, j) => {
      const el = this.el.nativeElement.querySelector(`#graph-line-${j}`);
      if (el) { lineElMap.set(j, el); lineByName.set(line.name, j); }
    });

    // Line → Line
    this.allLines.forEach((line, j) => {
      if (line.isRoot) return;
      (line.sourceEndpoints || []).forEach(sep => {
        if (sep === '.') return;
        const parentIdx = lineByName.get(sep);
        if (parentIdx === undefined) return;
        const parentEl = lineElMap.get(parentIdx);
        const childEl = lineElMap.get(j);
        if (!parentEl || !childEl) return;
        try { this.leaderLines.push(new LeaderLine(parentEl, childEl, noArrow)); } catch (e) {}
      });
    });
  }

  fetchChannels() {
    this.channelInfoService.queryChannelPage({ queryName: '', page: 1, length: 200 })
      .subscribe(({ body }) => {
        this.channelOptions = (body.data || []).map(c => ({ label: c.name, value: c.id, country: c.country }));
        this.filterChannelOptions();
      });
  }

  onCountryChange(cc: any) {
    this.selectedCountry = cc as string;
    this.selectedChannel = null;
    this.filterChannelOptions();
  }

  filterChannelOptions() {
    this.filteredChannelOptions = this.selectedCountry
      ? this.channelOptions.filter(c => c.country === this.selectedCountry)
      : this.channelOptions;
  }

  onChannelChange(selected: any) {
    this.queryParam.channelId = selected?.value || null;
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

  protected readonly getRowColor = getRowColor;

  isNetworkLine(nodeType: string): boolean {
    return ['LEASED_LINE', 'IPSEC_VPN', 'INTERNET'].includes(nodeType);
  }
}
