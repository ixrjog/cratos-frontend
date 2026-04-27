import { Component, Input, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../../../@core/data/base-data';
import { ChannelNodePageQuery, ChannelNodeVO } from '../../../../../../@core/data/channel-line';
import { ChannelNodeService } from '../../../../../../@core/services/channel-line.service';
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
  table: Table<ChannelNodeVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(
    private channelNodeService: ChannelNodeService,
    private toastUtil: ToastUtil,
  ) {}

  ngOnInit(): void {
    this.channelBusinessId = this.data['formData']['id'];
    this.channelId = this.data['formData']['channelId'];
    this.fetchLinkedLines();
    this.fetchLines();
  }

  fetchLinkedLines() {
    this.channelNodeService.queryChannelBusinessNodes({ channelBusinessId: this.channelBusinessId })
      .subscribe(({ body }) => {
        this.linkedLines = (body || []).map(link => ({ ...link, lineName: link.name }));
      });
  }

  fetchLines() {
    const param: ChannelNodePageQuery = {
      queryName: this.queryParam.queryName,
      channelId: this.channelId,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchValidData(this.table, this.channelNodeService.queryChannelNodePage(param));
  }

  pageIndexChange(p) { this.table.pager.pageIndex = p; this.fetchLines(); }
  pageSizeChange(s) { this.table.pager.pageSize = s; this.fetchLines(); }

  onAddLine(line: ChannelNodeVO) {
    this.channelNodeService.addChannelBusinessNode({
      channelBusinessId: this.channelBusinessId,
      channelNodeId: line.id,
      valid: true,
      comment: '',
    }).subscribe(() => {
      this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
      this.fetchLinkedLines();
    });
  }

  onRemoveLine(linked: any) {
    console.log('Delete linked:', linked);
    this.channelNodeService.deleteChannelBusinessNodeById({ businessId: this.channelBusinessId, nodeId: linked.channelNodeId })
      .subscribe(() => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
        this.fetchLinkedLines();
      });
  }

  addForm() { return null; }
  updateForm() { return null; }
}
