import { Component, Input, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../../../@core/data/base-data';
import { ChannelLinePageQuery, ChannelLineVO } from '../../../../../../@core/data/channel-line';
import { ChannelLineService } from '../../../../../../@core/services/channel-line.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../../../@shared/utils/toast.util';
import { onFetchValidData } from '../../../../../../@shared/utils/data-table.utli';

@Component({
  selector: 'app-channel-business-line-editor',
  templateUrl: './channel-business-line-editor.component.html',
  styleUrls: ['./channel-business-line-editor.component.less'],
})
export class ChannelBusinessLineEditorComponent implements OnInit {

  @Input() data: any;
  channelBusinessId: number;
  channelId: number;

  linkedLines: any[] = [];
  queryParam = { queryName: '' };
  table: Table<ChannelLineVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(
    private channelLineService: ChannelLineService,
    private toastUtil: ToastUtil,
  ) {}

  ngOnInit(): void {
    this.channelBusinessId = this.data['formData']['id'];
    this.channelId = this.data['formData']['channelId'];
    this.fetchLinkedLines();
    this.fetchLines();
  }

  fetchLinkedLines() {
    this.channelLineService.queryChannelBusinessLines({ channelBusinessId: this.channelBusinessId })
      .subscribe(({ body }) => {
        const links = body || [];
        // Fetch line details to get names
        this.channelLineService.queryChannelLinePage({ queryName: '', channelId: this.channelId, page: 1, length: 200 })
          .subscribe(({ body: lineBody }) => {
            const lineMap = new Map<number, string>();
            (lineBody.data || []).forEach(l => lineMap.set(l.id, l.name));
            this.linkedLines = links.map(link => ({
              ...link,
              lineName: lineMap.get(link.channelLineId) || `#${link.channelLineId}`,
            }));
          });
      });
  }

  fetchLines() {
    const param: ChannelLinePageQuery = {
      queryName: this.queryParam.queryName,
      channelId: this.channelId,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.channelLineService.queryChannelLinePage(param));
  }

  pageIndexChange(p) { this.table.pager.pageIndex = p; this.fetchLines(); }
  pageSizeChange(s) { this.table.pager.pageSize = s; this.fetchLines(); }

  onAddLine(line: ChannelLineVO) {
    this.channelLineService.addChannelBusinessLine({
      channelBusinessId: this.channelBusinessId,
      channelLineId: line.id,
      valid: true,
      comment: '',
    }).subscribe(() => {
      this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
      this.fetchLinkedLines();
    });
  }

  onRemoveLine(linked: any) {
    this.channelLineService.deleteChannelBusinessLineById({ id: linked.id })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
        this.fetchLinkedLines();
      });
  }

  addForm() { return null; }
  updateForm() { return null; }
}
