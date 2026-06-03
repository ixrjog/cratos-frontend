import { Component } from '@angular/core';
import { ApiSecurityRiskService } from '../../../@core/services/api-security-risk.service';
import { TrafficLayerService } from '../../../@core/services/traffic-layer.service';

@Component({
  selector: 'app-api-security-test',
  templateUrl: './api-security-test.component.html',
  styleUrls: ['./api-security-test.component.less'],
})
export class ApiSecurityTestComponent {

  private storageKey = 'api-security-test-form';

  requestMessage = '';
  originServer = '';
  ppToken = '';
  signatureAlgorithm = 'PALMPAYAPPSIGN';
  privateKeyType = 'DEBUG';
  convertToHTTPS = true;
  showToken = false;
  loading = false;
  response = '';
  responseHeaders = '';
  statusCode: number = 0;

  // 域名解析信息
  recordInfo: { recordName: string; originServer: string; routeTrafficTo: string } = null;

  // 帮助文档
  helpDoc = '';

  // 签名映射
  signMapYaml = '';
  signMapVisible = false;
  signMapData: { [key: string]: string[] } = {};
  autoMatchSign = true;
  signMatchStatus = '';
  private lastQueriedDomain = '';
  bodyPreviewVisible = false;
  bodyPreviewContent = '';
  aceEditorVisible = true;

  signatureAlgorithmOptions = ['PALMPAYAPPSIGN', 'FLEXIBANKAPPSIGN', 'ADMINPALMMERCHANTSIGN', 'PARTNERAPPSIGN', 'APIPALMPAYH5SIGN', 'PALMPAYBUSINESSAPPSIGN', 'APIBUSINESSWEBSIGN', 'TZAPPSIGN', 'NILEWEBSIGN', 'NONE'];
  privateKeyTypeOptions = ['DEBUG', 'RELEASE'];

  constructor(private apiSecurityRiskService: ApiSecurityRiskService,
              private trafficLayerService: TrafficLayerService) {
    this.loadForm();
    this.loadSignMap();
    this.loadHelpDoc();
  }

  loadSignMap() {
    this.apiSecurityRiskService.getAutoSignMapYaml().subscribe((res: any) => {
      this.signMapYaml = res.body || '';
      this.parseSignMap();
      this.parseDomainAndQuery();
    });
  }

  private parseSignMap() {
    this.signMapData = {};
    if (!this.signMapYaml) return;
    const lines = this.signMapYaml.split('\n');
    let currentKey = '';
    for (const line of lines) {
      if (!line.trim()) continue;
      if (!line.startsWith(' ') && !line.startsWith('-') && line.endsWith(':')) {
        currentKey = line.replace(':', '').trim();
        this.signMapData[currentKey] = [];
      } else if (line.trim().startsWith('-') && currentKey) {
        this.signMapData[currentKey].push(line.trim().replace(/^-\s*/, ''));
      }
    }
  }

  matchSignatureByHost(): string | null {
    const domain = this.extractDomain();
    if (!domain) return null;
    for (const [algorithm, hosts] of Object.entries(this.signMapData)) {
      if (hosts.some(h => domain.includes(h) || h.includes(domain))) {
        return algorithm;
      }
    }
    return null;
  }

  private matchPrivateKeyType(domain: string): string {
    const prefix = domain.split('.')[0].toLowerCase();
    return /test|dev|daily|sit/.test(prefix) ? 'DEBUG' : 'RELEASE';
  }

  openSignMapEditor() {
    this.showDiff = false;
    this.signMapVisible = true;
  }

  cancelSignMap() {
    if (this.showDiff && this.signMapOld) {
      this.signMapYaml = this.signMapOld;
    }
    this.signMapVisible = false;
  }

  signMapOld = '';
  showDiff = false;

  getDiffLines(): { prefix: string; text: string; type: string }[] {
    const oldLines = this.signMapOld.split('\n');
    const newLines = this.signMapYaml.split('\n');
    const result: { prefix: string; text: string; type: string }[] = [];
    const oldSet = new Set(oldLines);
    const newSet = new Set(newLines);
    // Show all new lines, mark added ones
    for (const line of newLines) {
      if (!oldSet.has(line)) {
        result.push({ prefix: '+', text: line, type: 'added' });
      } else {
        result.push({ prefix: ' ', text: line, type: 'unchanged' });
      }
    }
    return result;
  }

  quickAddSignMap() {
    const domain = this.extractDomain();
    if (!domain) return;
    const algo = this.signatureAlgorithm;
    if (this.signMapYaml.includes('- ' + domain)) {
      alert(`"${domain}" already exists in sign map`);
      return;
    }
    this.signMapOld = this.signMapYaml;
    if (!this.signMapYaml.includes(algo + ':')) {
      this.signMapYaml += `\n${algo}:\n  - ${domain}`;
    } else {
      this.signMapYaml = this.signMapYaml.replace(
        algo + ':',
        `${algo}:\n  - ${domain}`,
      );
    }
    this.showDiff = true;
    this.signMapVisible = true;
  }

  signMapError = '';


  saveSignMap() {
    // 校验 YAML 格式
    try {
      const lines = this.signMapYaml.split('\n');
      let valid = true;
      for (const line of lines) {
        if (!line.trim()) continue;
        if (!line.startsWith(' ') && !line.startsWith('-') && !line.endsWith(':')) {
          if (!line.trim().startsWith('-')) {
            valid = false;
            break;
          }
        }
      }
      if (!valid) throw new Error('Invalid format');
      this.signMapError = '';
    } catch (e) {
      this.signMapError = 'YAML格式错误，请检查格式：\nALGORITHM_NAME:\n  - domain.com';
      return;
    }
    this.apiSecurityRiskService.saveAutoSignMap({ signMapYaml: this.signMapYaml }).subscribe({
      next: () => {
        this.parseSignMap();
        this.lastQueriedDomain = '';
        this.parseDomainAndQuery();
        this.signMapVisible = false;
        this.signMapError = '';
      },
      error: (err) => {
        this.signMapError = err?.error?.msg || '保存失败，请检查YAML格式';
      },
    });
  }

  private loadHelpDoc() {
    fetch('assets/docs/origin-server-request.md')
      .then(res => res.text())
      .then(text => this.helpDoc = text)
      .catch(() => this.helpDoc = '');
  }

  private loadForm() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      this.requestMessage = data.requestMessage || '';
      this.originServer = data.originServer || '';
      this.ppToken = data.ppToken || '';
      this.signatureAlgorithm = data.signatureAlgorithm || 'PALMPAYAPPSIGN';
      this.privateKeyType = data.privateKeyType || 'DEBUG';
      this.convertToHTTPS = data.convertToHTTPS !== false;
      this.autoMatchSign = data.autoMatchSign !== false;
    }
    const savedResp = localStorage.getItem(this.storageKey + '-response');
    if (savedResp) {
      const resp = JSON.parse(savedResp);
      this.statusCode = resp.statusCode || 0;
      this.responseHeaders = resp.responseHeaders || '';
      this.response = resp.response || '';
    }
  }

  saveForm() {
    localStorage.setItem(this.storageKey, JSON.stringify({
      requestMessage: this.requestMessage,
      originServer: this.originServer,
      ppToken: this.ppToken,
      signatureAlgorithm: this.signatureAlgorithm,
      privateKeyType: this.privateKeyType,
      convertToHTTPS: this.convertToHTTPS,
      autoMatchSign: this.autoMatchSign,
    }));
    this.parseDomainAndQuery();
  }

  parseDomainAndQuery() {
    const domain = this.extractDomain();
    if (!domain) {
      this.recordInfo = null;
      this.originServer = '';
      this.lastQueriedDomain = '';
      return;
    }
    // 自动匹配签名算法
    if (this.autoMatchSign) {
      const matched = this.matchSignatureByHost();
      if (matched) {
        this.signatureAlgorithm = matched;
        this.signMatchStatus = 'matched';
      } else {
        this.signMatchStatus = 'unmatched';
      }
    } else {
      this.signMatchStatus = '';
    }
    // 自动匹配私钥类型
    this.privateKeyType = this.matchPrivateKeyType(domain);
    // host 没变化时不重新查询源站信息
    if (domain === this.lastQueriedDomain) {
      return;
    }
    this.lastQueriedDomain = domain;
    this.originServer = '';
    this.recordInfo = null;
    this.trafficLayerService.queryTrafficLayerRecordPage({
      queryName: domain, page: 1, length: 10, domainId: null, hasRouteTrafficTo: null,
    }).subscribe((res: any) => {
      const data = res?.body?.data;
      // 精确匹配 recordName
      const match = data?.find(r => r.recordName === domain);
      if (match) {
        this.recordInfo = {
          recordName: match.recordName,
          originServer: match.originServer,
          routeTrafficTo: match.routeTrafficTo,
        };
        if (match.routeTrafficTo) {
          this.originServer = match.originServer || '';
        }
      } else {
        this.recordInfo = null;
      }
    });
  }

  private extractDomain(): string {
    if (!this.requestMessage) return null;
    const firstLine = this.requestMessage.split('\n')[0];
    const match = firstLine.match(/https?:\/\/([^\/\s]+)/);
    return match ? match[1] : null;
  }

  callApi() {
    if (!this.requestMessage) {
      return;
    }
    this.saveForm();
    this.loading = true;
    this.response = '';
    const param = {
      requestMessage: this.requestMessage,
      originServer: this.originServer || null,
      ppToken: this.ppToken || null,
      signatureAlgorithm: this.signatureAlgorithm,
      privateKeyType: this.privateKeyType,
      convertToHTTPS: this.convertToHTTPS,
    };
    this.apiSecurityRiskService.callTestApi(param).subscribe({
      next: (res: any) => {
        const data = res.body;
        this.statusCode = data?.statusCode || 0;
        this.responseHeaders = JSON.stringify(data?.headers || {}, null, 2);
        const body = data?.body;
        this.response = typeof body === 'string' ? this.tryFormatJson(body) : JSON.stringify(body, null, 2);
        this.loading = false;
        this.saveResponse();
      },
      error: (err) => {
        this.statusCode = 0;
        this.responseHeaders = '';
        this.response = JSON.stringify(err, null, 2);
        this.loading = false;
        this.saveResponse();
      },
    });
  }

  private tryFormatJson(str: string): string {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  }

  private saveResponse() {
    localStorage.setItem(this.storageKey + '-response', JSON.stringify({
      statusCode: this.statusCode,
      responseHeaders: this.responseHeaders,
      response: this.response,
    }));
  }

  clearResponse() {
    this.statusCode = 0;
    this.responseHeaders = '';
    this.response = '';
    localStorage.removeItem(this.storageKey + '-response');
  }

  copyResponseAsMd() {
    const domain = this.extractDomain();
    const username = localStorage.getItem('username') || '';
    const dateStr = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }).format(new Date());
    const md = `## ${this.requestMessage.split('\n')[0]?.trim() || ''}

**Status:** ${this.statusCode} | **Host:** ${domain || ''}

### Request
\`\`\`
${this.requestMessage}
\`\`\`

### Response Headers
\`\`\`json
${this.responseHeaders}
\`\`\`

### Response Body
\`\`\`json
${this.response}
\`\`\`

---
Test by: ${username}
Date: ${dateStr}
`;
    navigator.clipboard.writeText(md);
  }

  showBodyPreview() {
    const lines = this.requestMessage.split('\n');
    let inBody = false;
    let body = '';
    for (const line of lines) {
      if (inBody) {
        body += line;
      } else if (line.trim() === '') {
        inBody = true;
      }
    }
    try {
      this.bodyPreviewContent = body ? JSON.stringify(JSON.parse(body), null, 2) : '';
    } catch {
      this.bodyPreviewContent = body || '';
    }
    this.bodyPreviewVisible = true;
  }

  saveBodyToMessage() {
    // 压缩 JSON 为单行
    let compactBody = '';
    try {
      compactBody = JSON.stringify(JSON.parse(this.bodyPreviewContent));
    } catch {
      compactBody = this.bodyPreviewContent.replace(/\n/g, '');
    }
    // 替换报文中的 body 部分
    const lines = this.requestMessage.split('\n');
    let headerPart = '';
    for (let i = 0; i < lines.length; i++) {
      headerPart += lines[i] + '\n';
      if (lines[i].trim() === '') {
        break;
      }
    }
    this.bodyPreviewVisible = false;
    this.aceEditorVisible = false;
    this.requestMessage = headerPart + compactBody;
    setTimeout(() => {
      this.aceEditorVisible = true;
      this.saveForm();
    });
  }
}
