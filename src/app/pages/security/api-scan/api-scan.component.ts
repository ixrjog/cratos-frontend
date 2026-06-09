import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../@core/services/api.service';
import { ApplicationService } from '../../../@core/services/application.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-api-scan',
  templateUrl: './api-scan.component.html',
  styleUrls: ['./api-scan.component.less'],
})
export class ApiScanComponent implements OnInit {

  results: any[] = [];
  loading = false;
  scanning = false;
  filterAppName = '';
  filterPath = '';
  showConfig = false;
  configYaml = '';
  selectedApp: any = null;
  pager = { pageIndex: 1, pageSize: 20, total: 0 };

  onSearchApplication = (term: string) => {
    return this.applicationService.queryApplicationPage({ queryName: term, page: 1, length: 20 } as any)
      .pipe(
        map(({ body }) => body.data.map((app, index) => ({ id: index, option: app }))),
      );
  };

  constructor(private apiService: ApiService, private applicationService: ApplicationService) {}

  ngOnInit() {
    this.fetchResults();
  }

  fetchResults() {
    this.loading = true;
    this.apiService.post('/security', '/api-scan/results/query', {
      queryName: this.filterAppName,
      queryPath: this.filterPath,
      page: this.pager.pageIndex,
      length: this.pager.pageSize,
    }).subscribe((res: any) => {
        this.results = res?.body?.data || [];
        this.pager.total = res?.body?.totalNum || 0;
        this.loading = false;
      });
  }

  pageIndexChange(pageIndex: number) {
    this.pager.pageIndex = pageIndex;
    this.fetchResults();
  }

  pageSizeChange(pageSize: number) {
    this.pager.pageSize = pageSize;
    this.fetchResults();
  }

  executeScan() {
    this.scanning = true;
    this.apiService.post('/security', '/api-scan/execute')
      .subscribe(() => {
        this.scanning = false;
        this.fetchResults();
      }, () => {
        this.scanning = false;
      });
  }

  scanApplication(appName: string) {
    this.apiService.post('/security', '/api-scan/application/execute?applicatonName=' + encodeURIComponent(appName))
      .subscribe(() => {
        this.fetchResults();
      });
  }

  scanSelectedApp() {
    if (!this.selectedApp) return;
    this.scanApplication(this.selectedApp.name);
  }

  getSeverityStyle(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'red-w98';
      case 'HIGH': return 'orange-w98';
      case 'MEDIUM': return 'blue-w98';
      default: return 'default';
    }
  }

  toggleConfig() {
    if (!this.showConfig) {
      this.apiService.get('/security', '/api-scan/config/get', {})
        .subscribe((res: any) => {
          this.configYaml = res?.body || '';
          this.showConfig = true;
        });
    } else {
      this.showConfig = false;
    }
  }

  loadConfig() {
    this.apiService.get('/security', '/api-scan/config/get', {})
      .subscribe((res: any) => {
        this.configYaml = res?.body || '';
      });
  }

  saveConfig() {
    this.apiService.post('/security', '/api-scan/config/save', { configYaml: this.configYaml })
      .subscribe(() => {});
  }

  onConfigChange(value: string) {
    this.configYaml = value;
  }

  copySummary(row: any) {
    const summary = `**API Security Scan Issue**\n\n` +
      `| Item | Detail |\n|------|--------|\n` +
      `| Application | ${row.appName} |\n` +
      `| Deployment | ${row.deploymentName} |\n` +
      `| Path | \`${row.method} ${row.path}\` |\n` +
      `| Status | ${row.statusCode} |\n` +
      `| Severity | ${row.severity} |\n` +
      `| Category | ${row.category} |\n` +
      `| Group | ${row.groupName} |\n` +
      `| Scan Batch | ${row.scanBatch} |\n\n` +
      (row.resp ? `**Response:**\n\`\`\`\n${row.resp}\n\`\`\`\n\n` : '') +
      `> Please check and fix this exposed endpoint.`;
    navigator.clipboard.writeText(summary);
  }
}
