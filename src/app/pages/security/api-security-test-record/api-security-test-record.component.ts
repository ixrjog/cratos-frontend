import { Component, OnInit } from '@angular/core';
import { ApiSecurityRiskService } from '../../../@core/services/api-security-risk.service';
import { Table, TABLE_DATA } from '../../../@core/data/base-data';

@Component({
  selector: 'app-api-security-test-record',
  templateUrl: './api-security-test-record.component.html',
  styleUrls: ['./api-security-test-record.component.less'],
})
export class ApiSecurityTestRecordComponent implements OnInit {

  queryParam = { queryName: '', username: '' };
  table: Table<any> = JSON.parse(JSON.stringify(TABLE_DATA));
  detailVisible = false;
  detailData: any = null;
  limit = 86400;

  constructor(private apiSecurityRiskService: ApiSecurityRiskService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.table.loading = true;
    const param = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    this.apiSecurityRiskService.queryTestRecordPage(param).subscribe(({ body }) => {
      this.table.data = body.data;
      this.table.pager.total = body.totalNum;
      this.table.loading = false;
    });
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

  formatElapsed(ms: number): string {
    if (ms == null) return '-';
    if (ms < 1000) return ms + 'ms';
    if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
    return (ms / 60000).toFixed(1) + 'min';
  }

  formatJson(str: string): string {
    if (!str) return '';
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  }

  onViewDetail(rowItem: any) {
    this.apiSecurityRiskService.getTestRecordSummary(rowItem.id).subscribe((res: any) => {
      this.detailData = res.body;
      this.detailVisible = true;
    });
  }

  copyAsMarkdown() {
    const d = this.detailData;
    if (!d) return;
    const md = `## ${d.requestMethod} ${d.requestUrl}

**Status:** ${d.responseStatus} | **Elapsed:** ${this.formatElapsed(d.elapsedMs)}

### Request Headers
\`\`\`json
${this.formatJson(d.requestHeaders)}
\`\`\`

### Request Body
\`\`\`json
${this.formatJson(d.requestBody || '')}
\`\`\`

### Response Headers
\`\`\`json
${this.formatJson(d.responseHeaders || '')}
\`\`\`

### Response Body
\`\`\`json
${this.formatJson(d.responseBody || '')}
\`\`\`
`;
    navigator.clipboard.writeText(md);
  }
}
