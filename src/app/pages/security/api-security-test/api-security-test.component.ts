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

  signatureAlgorithmOptions = ['PALMPAYAPPSIGN', 'FLEXIBANKAPPSIGN', 'ADMINPALMMERCHANTSIGN', 'PARTNERAPPSIGN', 'NONE'];
  privateKeyTypeOptions = ['DEBUG', 'RELEASE'];

  constructor(private apiSecurityRiskService: ApiSecurityRiskService,
              private trafficLayerService: TrafficLayerService) {
    this.loadForm();
    this.loadSignMap();
    this.parseDomainAndQuery();
    this.loadHelpDoc();
  }

  loadSignMap() {
    this.apiSecurityRiskService.getAutoSignMapYaml().subscribe((res: any) => {
      this.signMapYaml = res.body || '';
      this.parseSignMap();
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
    this.signMapVisible = true;
  }

  saveSignMap() {
    this.apiSecurityRiskService.saveAutoSignMap({ signMapYaml: this.signMapYaml }).subscribe(() => {
      this.parseSignMap();
      this.signMapVisible = false;
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
      return;
    }
    this.originServer = '';
    this.recordInfo = null;
    // 自动匹配签名算法
    if (this.autoMatchSign) {
      const matched = this.matchSignatureByHost();
      if (matched) {
        this.signatureAlgorithm = matched;
      }
    }
    // 自动匹配私钥类型
    this.privateKeyType = this.matchPrivateKeyType(domain);
    this.trafficLayerService.queryTrafficLayerRecordPage({
      queryName: domain, page: 1, length: 1, domainId: null, hasRouteTrafficTo: null,
    }).subscribe((res: any) => {
      const data = res?.body?.data;
      if (data && data.length > 0) {
        this.recordInfo = {
          recordName: data[0].recordName,
          originServer: data[0].originServer,
          routeTrafficTo: data[0].routeTrafficTo,
        };
        if (data[0].routeTrafficTo) {
          this.originServer = data[0].originServer || '';
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
}
