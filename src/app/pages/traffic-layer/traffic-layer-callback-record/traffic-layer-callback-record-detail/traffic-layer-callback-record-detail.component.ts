import { AfterViewChecked, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TrafficLayerService } from '../../../../@core/services/traffic-layer.service';
import {
  TrafficLayerDomainVO,
  TrafficLayerRecordQueryDetails,
  CloudFlareWorkersCallbackRule,
} from '../../../../@core/data/traffic-layer';
import { finalize } from 'rxjs';
import { FormLayout } from 'ng-devui/form';
import { DialogService } from 'ng-devui';
import { ToastUtil } from '../../../../@shared/utils/toast.util';

declare var LeaderLine: any;

@Component({
  selector: 'app-traffic-layer-callback-record-detail',
  templateUrl: './traffic-layer-callback-record-detail.component.html',
  styleUrls: [ './traffic-layer-callback-record-detail.component.less' ],
})
export class TrafficLayerCallbackRecordDetailComponent implements OnInit, AfterViewChecked, OnDestroy {

  private static readonly DOMAIN_STORAGE_KEY = 'traffic_callback_record_selected_domain';
  private static readonly ENV_STORAGE_KEY = 'traffic_callback_record_selected_env';

  trafficLayerDomain: TrafficLayerDomainVO;
  loading = false;
  showRecord = false;
  tableDetails = {
    recordTable: '',
    lbTable: '',
    ingressRuleTable: '',
  };
  queryParam = {
    domainId: null,
    envName: '',
  };

  /** All callback domains (loaded from /domain/callback/query). */
  callbackDomains: TrafficLayerDomainVO[] = [];
  /** Currently active domain tab id. */
  activeDomainId: any = null;

  /** CloudFlare Workers callback rules / IP whitelist view state. */
  showWorkersRules = false;
  workersRulesLoading = false;
  workersRulesError = '';
  workersRulesRaw = '';
  workersRules: CloudFlareWorkersCallbackRule[] = [];
  /** CloudFlare 控制台地址(来自查询响应的 dashUrl)，用于快捷跳转。 */
  workersDashUrl = '';
  /** LeaderLine instances connecting the root node to each rule node. */
  private ruleLines: any[] = [];
  private needDrawRuleLines = false;

  /** Template rendered inside the raw-JSON dialog. */
  @ViewChild('rawJsonTpl') rawJsonTpl: TemplateRef<any>;
  /** Template rendered inside the CIDR detail dialog. */
  @ViewChild('cidrDetailTpl') cidrDetailTpl: TemplateRef<any>;
  /** Template rendered inside the visual rule-builder dialog. */
  @ViewChild('ruleBuilderTpl') ruleBuilderTpl: TemplateRef<any>;

  /** Rules being edited in the visual builder. */
  builderRules: { name: string; paths: string[]; whitelist: string[] }[] = [];

  constructor(private trafficLayerService: TrafficLayerService,
              private dialogService: DialogService,
              private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.showRecord = false;
    document.addEventListener('scroll', this.onDocScroll, true);
    this.loadCallbackDomains();
    const savedDomain = localStorage.getItem(TrafficLayerCallbackRecordDetailComponent.DOMAIN_STORAGE_KEY);
    const savedEnv = localStorage.getItem(TrafficLayerCallbackRecordDetailComponent.ENV_STORAGE_KEY);
    if (savedDomain) {
      try {
        const domain = JSON.parse(savedDomain);
        this.trafficLayerDomain = domain;
        this.activeDomainId = domain.id;
        this.queryParam.domainId = domain.id;
        this.getEnvItems(domain.id);
        if (savedEnv) {
          this.queryParam.envName = savedEnv;
          this.tabActiveId = savedEnv;
        }
      } catch (e) {}
    }
  }

  private loadCallbackDomains() {
    this.trafficLayerService.queryCallbackDomain()
      .subscribe(({ body }) => {
        this.callbackDomains = body || [];
        // Replace the restored partial domain with the full object so tags/dns render.
        if (this.activeDomainId != null) {
          const full = this.callbackDomains.find(d => d.id === this.activeDomainId);
          if (full) {
            this.trafficLayerDomain = full;
          }
        }
      });
  }

  onDomainTabChange(domainId: any) {
    const domain = this.callbackDomains.find(d => d.id === domainId);
    if (domain) {
      this.onTrafficLayerDomainChange(domain);
    }
  }

  fetchData() {
    const param: TrafficLayerRecordQueryDetails = {
      ...this.queryParam,
    };
    this.showRecord = true;
    this.loading = true;
    this.trafficLayerService.queryRecordDetails(param)
      .pipe(
        finalize(() => this.loading = false),
      )
      .subscribe(({ body }) => {
        this.tableDetails = body.tableDetails;
      });
  }

  /** Fetch and display the CloudFlare Workers callback rules / IP whitelist for the selected domain. */
  viewWorkersRules() {
    if (!this.trafficLayerDomain || !this.trafficLayerDomain.domain) {
      return;
    }
    this.showWorkersRules = true;
    this.workersRulesLoading = true;
    this.workersRulesError = '';
    this.workersRulesRaw = '';
    this.workersRules = [];
    this.workersDashUrl = '';
    this.removeRuleLines();
    this.trafficLayerService.queryCloudFlareWorkersCallbackRules({ callbackDomain: this.trafficLayerDomain.domain })
      .pipe(
        finalize(() => this.workersRulesLoading = false),
      )
      .subscribe(({ body }) => {
        this.workersDashUrl = body?.dashUrl || '';
        const rulesText = body?.rules;
        if (!rulesText) {
          this.workersRulesError = 'No CloudFlare Workers rules are configured for this callback domain.';
          return;
        }
        const parsed = this.parseRulesPayload(rulesText);
        // Show a pretty version when parseable, otherwise the original text.
        this.workersRulesRaw = parsed !== undefined ? this.prettyStringify(parsed) : rulesText;
        if (parsed === undefined) {
          this.workersRulesError = 'Rules payload could not be parsed; view the raw JSON below.';
          return;
        }
        const list = Array.isArray(parsed) ? parsed : parsed?.rules;
        this.workersRules = Array.isArray(list) ? list : [];
        if (!this.workersRules.length) {
          this.workersRulesError = 'No rules found in the payload; view the raw JSON below.';
        } else {
          // Trigger the LeaderLine graph draw after the DOM renders.
          this.needDrawRuleLines = true;
        }
      });
  }

  /** 打开 CloudFlare 控制台(dashUrl) */
  openCloudFlareDash() {
    if (this.workersDashUrl) {
      window.open(this.workersDashUrl, '_blank', 'noopener');
    }
  }

  /**
   * Tolerant parse of the rules payload. Accepts:
   *  - strict JSON
   *  - double-encoded JSON (a JSON string containing JSON)
   *  - JS object-literal style (unquoted keys / single quotes / trailing commas)
   * Returns the parsed object/array, or undefined if it cannot be parsed.
   */
  private parseRulesPayload(text: string): any {
    let parsed = this.tryJson(text);
    // double-encoded: parse yielded a string that is itself JSON
    if (typeof parsed === 'string') {
      const inner = this.tryJson(parsed);
      if (inner !== undefined) {
        parsed = inner;
      }
    }
    // lenient: normalize JS object-literal to JSON, then parse
    if (parsed === undefined || typeof parsed === 'string') {
      const loose = this.tryJson(this.normalizeLoose(text));
      if (loose !== undefined) {
        parsed = loose;
      }
    }
    // bare fragment: e.g. "rules: [ ... ]" (no surrounding braces) -> wrap and retry
    if (parsed === undefined || typeof parsed === 'string') {
      const trimmed = (text || '').trim();
      if (trimmed && !trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        const wrapped = this.tryJson(this.normalizeLoose('{' + trimmed + '}'));
        if (wrapped !== undefined) {
          parsed = wrapped;
        }
      }
    }
    return parsed;
  }

  private tryJson(text: string): any {
    try {
      return JSON.parse(text);
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Normalize a JS object-literal into JSON. Values here are IPs/paths only (no embedded quotes),
   * so this is safe. NOTE: comment stripping is intentionally omitted so wildcard paths stay intact.
   */
  private normalizeLoose(text: string): string {
    return text
      .replace(/'/g, '"')                                        // single -> double quotes
      .replace(/([{,\[]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')  // quote unquoted keys
      .replace(/,(\s*[}\]])/g, '$1');                            // remove trailing commas
  }

  private prettyStringify(value: any): string {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  }

  /** Whether an entry allows all IPs (IPv4/IPv6 default routes). */
  isAllowAllIp(ip: string): boolean {
    return ip === '0.0.0.0/0' || ip === '::/0';
  }

  isCidr(ip: string): boolean {
    return !!ip && ip.includes('/') && !this.isAllowAllIp(ip);
  }

  /** Detail of the CIDR currently shown in the dialog. */
  cidrDetail: any = null;

  /** Open a dialog showing the expanded IP info for a CIDR entry. */
  openCidrDetail(cidr: string) {
    const info = this.computeCidrInfo(cidr);
    if (!info) {
      return;
    }
    this.cidrDetail = info;
    const results = this.dialogService.open({
      id: 'cf-cidr-detail',
      width: '520px',
      maxHeight: '80vh',
      title: 'CIDR ' + cidr,
      dialogtype: 'standard',
      backdropCloseable: true,
      contentTemplate: this.cidrDetailTpl,
      buttons: [
        {
          cssClass: 'common',
          text: 'Close',
          handler: () => results.modalInstance.hide(),
        },
      ],
    });
  }

  /** Compute network/range/host info and (capped) IP list for an IPv4 CIDR. */
  private computeCidrInfo(cidr: string): any {
    if (!cidr || cidr.indexOf('/') < 0) {
      return null;
    }
    const [addr, prefixStr] = cidr.split('/');
    const prefix = parseInt(prefixStr, 10);
    if (addr.includes(':')) {
      return { cidr, ipv6: true };   // IPv6：不枚举
    }
    const parts = addr.split('.').map(x => parseInt(x, 10));
    if (parts.length !== 4 || parts.some(x => isNaN(x) || x < 0 || x > 255)
      || isNaN(prefix) || prefix < 0 || prefix > 32) {
      return null;
    }
    const toStr = (n: number) => [ (n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255 ].join('.');
    const ipNum = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
    const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const network = (ipNum & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const total = Math.pow(2, 32 - prefix);
    const cap = 1024;
    const capped = total > cap;
    const limit = capped ? cap : total;
    const ips: string[] = [];
    for (let i = 0; i < limit; i++) {
      ips.push(toStr((network + i) >>> 0));
    }
    let usableFirst: string;
    let usableLast: string;
    let usableCount: number;
    if (prefix <= 30) {
      usableFirst = toStr((network + 1) >>> 0);
      usableLast = toStr((broadcast - 1) >>> 0);
      usableCount = total - 2;
    } else {
      usableFirst = toStr(network);
      usableLast = toStr(broadcast);
      usableCount = total;
    }
    return {
      cidr,
      ipv6: false,
      network: toStr(network),
      netmask: toStr(mask),
      broadcast: toStr(broadcast),
      first: toStr(network),
      last: toStr(broadcast),
      total,
      usableFirst,
      usableLast,
      usableCount,
      ips,
      capped,
      cap,
    };
  }

  /** devui tag labelStyle for an IP entry: green=single IP/CIDR, red=allow-all. */
  ipTagStyle(ip: string): string {
    return this.isAllowAllIp(ip) ? 'red-w98' : 'green-w98';
  }

  /** Custom tag color: allow-all (0.0.0.0/0, ::/0) => orange, all other IPs => green. */
  ipTagColor(ip: string): string {
    return this.isAllowAllIp(ip) ? 'rgb(255, 106, 13)' : 'rgb(95, 170, 21)';
  }

  /** Tooltip text describing an IP entry type. */
  ipTagTitle(ip: string): string {
    if (this.isAllowAllIp(ip)) {
      return 'Allows all IPs';
    }
    return this.isCidr(ip) ? 'CIDR range' : 'Single IP';
  }

  // ===== Visual rule builder =====
  trackByIndex(index: number): number {
    return index;
  }

  addRule() {
    this.builderRules.unshift({ name: '', paths: [ '' ], whitelist: [ '0.0.0.0/0' ] });
  }

  removeRule(index: number) {
    this.builderRules.splice(index, 1);
  }

  addPath(rule: any) {
    rule.paths.push('');
  }

  removePath(rule: any, index: number) {
    rule.paths.splice(index, 1);
  }

  addWhitelist(rule: any) {
    rule.whitelist.push('');
  }

  removeWhitelist(rule: any, index: number) {
    rule.whitelist.splice(index, 1);
  }

  /** Live JSON built from the builder state (trims empties). */
  get builderJson(): string {
    const rules = (this.builderRules || []).map(r => ({
      name: (r.name || '').trim(),
      paths: (r.paths || []).map(p => (p || '').trim()).filter(p => p.length > 0),
      whitelist: (r.whitelist || []).map(w => (w || '').trim()).filter(w => w.length > 0),
    }));
    return JSON.stringify({ rules }, null, 2);
  }

  /** Open the raw JSON in a dialog. */
  openRawJson() {
    // 用当前已解析的规则初始化可视化编辑器；没有则给一条空规则
    this.builderRules = (this.workersRules || []).map(r => ({
      name: r.name || '',
      paths: [ ...(r.paths || []) ],
      whitelist: [ ...(r.whitelist || []) ],
    }));
    if (!this.builderRules.length) {
      this.addRule();
    }
    const results = this.dialogService.open({
      id: 'cf-rules-raw-json',
      width: '70%',
      maxHeight: '90vh',
      title: 'CloudFlare Workers Rules — 编辑 / 复制 JSON',
      dialogtype: 'standard',
      backdropCloseable: false,
      contentTemplate: this.ruleBuilderTpl,
      buttons: [
        {
          cssClass: 'primary',
          text: 'Copy JSON',
          handler: () => this.copyToClipboard(this.builderJson),
        },
        {
          cssClass: 'common',
          text: 'Close',
          handler: () => results.modalInstance.hide(),
        },
      ],
    });
  }

  /** Copy the raw JSON to the clipboard. */
  copyRaw() {
    this.copyToClipboard(this.workersRulesRaw || '');
  }

  /** Build a Markdown doc for a single rule and copy it to the clipboard. */
  copyRuleMarkdown(rule: CloudFlareWorkersCallbackRule) {
    this.copyToClipboard(this.buildRuleMarkdown(rule));
  }

  /** Generate the Markdown document for a rule. */
  private buildRuleMarkdown(rule: CloudFlareWorkersCallbackRule): string {
    const lines: string[] = [];
    lines.push('#### 路由规则名称');
    lines.push('- ' + (rule?.name || '-'));
    lines.push('');
    lines.push('#### Callback域名');
    lines.push('- ' + (this.trafficLayerDomain?.domain || '-'));
    lines.push('');
    lines.push('#### API Paths');
    const paths = rule?.paths || [];
    if (paths.length) {
      paths.forEach(p => lines.push('- ' + p));
    } else {
      lines.push('- -');
    }
    lines.push('');
    lines.push('#### IP Whitelist');
    const ips = rule?.whitelist || [];
    if (ips.length) {
      ips.forEach(ip => lines.push('- ' + ip));
    } else {
      lines.push('- -');
    }
    return lines.join('\n');
  }

  /** Copy text to clipboard with an http-safe fallback + toast feedback. */
  private copyToClipboard(text: string) {
    const done = () => this.toastUtil.onSuccessToast('Copied to clipboard');
    const fail = () => this.toastUtil.onErrorToast('Copy failed');
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => this.fallbackCopy(text, done, fail));
      return;
    }
    this.fallbackCopy(text, done, fail);
  }

  private fallbackCopy(text: string, done: () => void, fail: () => void) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) {
      fail();
    }
  }

  ngAfterViewChecked(): void {
    if (this.needDrawRuleLines && this.showWorkersRules && this.workersRules.length) {
      this.needDrawRuleLines = false;
      setTimeout(() => this.drawRuleLines(), 100);
    } else if (this.ruleLines.length) {
      // Layout may have shifted (tab switch, record data loaded, raw toggle, etc.) -> keep lines glued.
      this.scheduleReposition();
    }
  }

  ngOnDestroy(): void {
    this.removeRuleLines();
    document.removeEventListener('scroll', this.onDocScroll, true);
  }

  /** Reposition existing lines on window resize. */
  @HostListener('window:resize')
  onWindowResize() {
    this.scheduleReposition();
  }

  /** Capturing scroll handler so inner scroll containers (not just window) also reposition lines. */
  private readonly onDocScroll = () => this.scheduleReposition();

  private repositionScheduled = false;

  /** Throttle position() to one call per animation frame to avoid layout thrashing. */
  private scheduleReposition() {
    if (this.repositionScheduled || !this.ruleLines.length) {
      return;
    }
    this.repositionScheduled = true;
    requestAnimationFrame(() => {
      this.repositionScheduled = false;
      this.ruleLines.forEach(l => {
        try {
          l.position();
        } catch (e) {
        }
      });
    });
  }

  private removeRuleLines() {
    this.ruleLines.forEach(l => {
      try {
        l.remove();
      } catch (e) {
      }
    });
    this.ruleLines = [];
  }

  /** Draw fluid connectors from the root (callback domain) node to each rule node. */
  private drawRuleLines() {
    this.removeRuleLines();
    if (!this.workersRules.length || typeof LeaderLine === 'undefined') {
      return;
    }
    const rootEl = document.getElementById('cf-rules-root');
    if (!rootEl) {
      return;
    }
    const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--devui-brand').trim() || '#5e7ce0';
    this.workersRules.forEach((rule, i) => {
      const ruleEl = document.getElementById('cf-rule-node-' + i);
      if (!ruleEl) {
        return;
      }
      try {
        this.ruleLines.push(new LeaderLine(rootEl, ruleEl, {
          color: lineColor + '99',
          size: 2,
          path: 'fluid',
          startSocket: 'right',
          endSocket: 'left',
          startPlug: 'behind',
          endPlug: 'arrow1',
        }));
      } catch (e) {
      }
    });
  }

  tabActiveId: string | number = '';
  envItems = [];

  activeTabChange(tab) {
    this.queryParam.envName = tab;
    localStorage.setItem(TrafficLayerCallbackRecordDetailComponent.ENV_STORAGE_KEY, tab || '');
  }

  getEnvItems(domainId: number) {
    this.envItems = [];
    this.trafficLayerService.queryTrafficLayerDomainEnv({ domainId: domainId })
      .subscribe(({ body }) => {
        this.envItems = body;
        if (this.envItems.length > 0) {
          let list = JSON.parse(JSON.stringify(this.envItems));
          for (; ;) {
            let env = list.pop();
            if (env.valid) {
              this.queryParam.envName = env.envName;
              this.tabActiveId = env.envName;
              localStorage.setItem(TrafficLayerCallbackRecordDetailComponent.ENV_STORAGE_KEY, env.envName);
              break;
            }
          }
        }
      });
  }

  onTrafficLayerDomainChange(domainVO: TrafficLayerDomainVO) {
    this.showRecord = false;
    this.showWorkersRules = false;
    this.workersRules = [];
    this.workersRulesRaw = '';
    this.workersRulesError = '';
    this.removeRuleLines();
    this.trafficLayerDomain = domainVO;
    this.activeDomainId = domainVO.id;
    this.queryParam.domainId = domainVO.id;
    this.queryParam.envName = '';
    localStorage.setItem(TrafficLayerCallbackRecordDetailComponent.DOMAIN_STORAGE_KEY, JSON.stringify({ id: domainVO.id, domain: domainVO.domain, name: domainVO.name }));
    localStorage.removeItem(TrafficLayerCallbackRecordDetailComponent.ENV_STORAGE_KEY);
    this.getEnvItems(domainVO.id);
  }

  protected readonly JSON = JSON;
  protected readonly FormLayout = FormLayout;
}
