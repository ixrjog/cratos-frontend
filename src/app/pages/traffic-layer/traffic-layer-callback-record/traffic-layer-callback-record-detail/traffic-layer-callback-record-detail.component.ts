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
  /** LeaderLine instances connecting the root node to each rule node. */
  private ruleLines: any[] = [];
  private needDrawRuleLines = false;

  /** Template rendered inside the raw-JSON dialog. */
  @ViewChild('rawJsonTpl') rawJsonTpl: TemplateRef<any>;

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
    this.removeRuleLines();
    this.trafficLayerService.queryCloudFlareWorkersCallbackRules({ callbackDomain: this.trafficLayerDomain.domain })
      .pipe(
        finalize(() => this.workersRulesLoading = false),
      )
      .subscribe(({ body }) => {
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

  /** devui tag labelStyle for an IP entry: green=single IP, orange=CIDR, red=allow-all. */
  ipTagStyle(ip: string): string {
    if (this.isAllowAllIp(ip)) {
      return 'red-w98';
    }
    return this.isCidr(ip) ? 'orange-w98' : 'green-w98';
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

  /** Open the raw JSON in a dialog. */
  openRawJson() {
    if (!this.workersRulesRaw) {
      return;
    }
    const results = this.dialogService.open({
      id: 'cf-rules-raw-json',
      width: '70%',
      maxHeight: '90vh',
      title: 'CloudFlare Workers Rules — Raw JSON',
      dialogtype: 'standard',
      backdropCloseable: true,
      contentTemplate: this.rawJsonTpl,
      buttons: [
        {
          cssClass: 'primary',
          text: 'Copy',
          handler: () => this.copyRaw(),
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
    const text = this.workersRulesRaw || '';
    const done = () => this.toastUtil.onSuccessToast('Copied to clipboard');
    const fail = () => this.toastUtil.onErrorToast('Copy failed');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fail);
      return;
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
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
