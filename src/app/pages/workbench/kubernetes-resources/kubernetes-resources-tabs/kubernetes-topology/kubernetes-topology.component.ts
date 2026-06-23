import { AfterViewChecked, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { finalize } from 'rxjs';
import { TrafficLayerService } from '../../../../../@core/services/traffic-layer.service';
import { ProjectLbListenerVO, ProjectLoadBalancerDetailVO, TopologyRouteVO, TrafficLayerTopologyVO, TrafficPathVO } from '../../../../../@core/data/traffic-layer';

declare var LeaderLine: any;

@Component({
  selector: 'app-kubernetes-topology',
  templateUrl: './kubernetes-topology.component.html',
  styleUrls: [ './kubernetes-topology.component.less' ],
})
export class KubernetesTopologyComponent implements OnChanges, AfterViewChecked, OnDestroy {

  /** Service (application) name used to query the traffic topology. */
  @Input() serviceName: string;
  /** Whether the topology tab is currently active (needed to (re)draw lines only when visible). */
  @Input() active = false;
  /** Current environment namespace (from the page), used by the env filter. */
  @Input() namespace: string;

  topology: TrafficLayerTopologyVO = null;
  loading = false;
  /** Index of the currently selected load balancer (within displayPaths). */
  activeLbIndex = 0;
  /** Filter routes by the current environment (namespace). Toggled by the "Current Env Only" checkbox. */
  filterByEnv = true;
  /** Traffic paths after applying the env filter (each with its visible domains). */
  displayPaths: { path: TrafficPathVO; domains: string[] }[] = [];

  /** On-demand LB detail (listeners/rules) for the currently expanded LB. */
  lbDetail: ProjectLoadBalancerDetailVO = null;
  /** assetId of the currently expanded LB (null when none). */
  lbDetailAssetId: number = null;
  lbDetailLoading = false;

  /** DNS CNAME check per domain: true = resolved CNAME matches the configured target. */
  dnsMatch: { [domain: string]: boolean } = {};
  /** Resolved CNAME value(s) per domain (for tooltip). */
  dnsResolved: { [domain: string]: string } = {};

  private loadedKey: string = null;
  private lines: any[] = [];
  private needDrawLines = false;

  constructor(private trafficLayerService: TrafficLayerService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Querying is manual (Query button). Manage lines on tab activation changes.
    if (changes['active']) {
      if (this.active) {
        // Tab became visible again -> redraw existing lines.
        this.needDrawLines = true;
      } else {
        // Tab hidden -> remove the LeaderLine SVGs (they live on document.body and won't hide otherwise).
        this.needDrawLines = false;
        this.removeLines();
      }
    }
  }

  /** Manual query triggered by the Query button. */
  onQuery() {
    if (!this.serviceName) {
      return;
    }
    this.fetchTopology();
  }

  /** Selected namespace: prefer the @Input, fall back to the page's persisted selection. */
  private effectiveNamespace(): string {
    return this.namespace || localStorage.getItem('k8s_resources_selected_namespace') || '';
  }

  /** Effective query key: service + namespace. */
  private currentKey(): string {
    return (this.serviceName || '') + '|' + this.effectiveNamespace();
  }

  fetchTopology() {
    this.removeLines();
    this.resetLbDetail();
    this.loadedKey = this.currentKey();
    this.loading = true;
    this.topology = null;
    const namespace = this.effectiveNamespace();
    this.trafficLayerService.queryServiceTopology({
      appName: this.serviceName,
      namespace: namespace || undefined,
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(({ body }) => {
        this.topology = body;
        this.activeLbIndex = 0;
        this.buildDisplayPaths();
      });
  }

  /** Build the visible traffic paths. When "Current Env Only" is checked, routes are filtered by namespace (frontend only). */
  buildDisplayPaths() {
    const ns = this.normalizeNs(this.effectiveNamespace());
    const paths = this.topology?.trafficPaths || [];
    this.displayPaths = paths
      .map(path => ({ path, domains: this.getVisibleDomains(path, ns) }))
      .filter(dp => dp.domains.length > 0);
    if (this.activeLbIndex >= this.displayPaths.length) {
      this.activeLbIndex = 0;
    }
    this.removeLines();
    this.needDrawLines = true;
    // DNS check is manual (triggered by the "DNS Check" button).
    this.dnsMatch = {};
    this.dnsResolved = {};
  }

  /** Domains of a path, filtered to the current namespace when the env filter is on. */
  private getVisibleDomains(path: TrafficPathVO, ns: string): string[] {
    const domains = this.getDomains(path);
    if (!this.filterByEnv || !ns) {
      return domains;
    }
    return domains.filter(domain => this.normalizeNs(this.getRoute(path, domain)?.namespace) === ns);
  }

  private normalizeNs(value: string): string {
    return (value || '').trim().toLowerCase();
  }

  /** Toggle the env filter: re-filter the already-loaded topology on the frontend (no re-query). */
  onFilterChange() {
    this.activeLbIndex = 0;
    this.resetLbDetail();
    this.buildDisplayPaths();
  }

  /** Manual DNS check (triggered by the DNS Check button). */
  onDnsCheck() {
    this.runDnsChecks();
  }

  /**
   * For each route domain, resolve its CNAME and compare with the configured target (cdn / originServer).
   * A match marks the route card with a green border.
   */
  private runDnsChecks() {
    this.dnsMatch = {};
    this.dnsResolved = {};
    this.displayPaths.forEach(dp => {
      dp.domains.forEach(domain => {
        const r = this.getRoute(dp.path, domain);
        const candidates = [r?.cdn, r?.originServer]
          .filter(c => !!c)
          .map(c => this.normalizeDns(c));
        if (candidates.length === 0) {
          return;
        }
        this.trafficLayerService.resolveDnsCname(domain).subscribe({
          next: ({ body }: any) => {
            const answers = ((body?.Answer || body?.answer || []) as any[])
              .map(a => this.normalizeDns(a?.data))
              .filter(a => !!a);
            this.dnsResolved[domain] = answers.join(', ');
            this.dnsMatch[domain] = answers.some(
              a => candidates.some(c => a === c || a.endsWith(c) || c.endsWith(a)));
          },
          error: () => {
            this.dnsMatch[domain] = false;
          },
        });
      });
    });
  }

  /** Lowercase + strip a trailing dot from a DNS name for comparison. */
  private normalizeDns(name: string): string {
    return (name || '').trim().toLowerCase().replace(/\.$/, '');
  }

  onLbTabChange(index: any) {
    this.activeLbIndex = index;
    this.resetLbDetail();
    this.removeLines();
    this.needDrawLines = true;
  }

  private resetLbDetail() {
    this.lbDetail = null;
    this.lbDetailAssetId = null;
    this.lbDetailLoading = false;
  }

  /** Domains (keys of the route map) of a traffic path. */
  getDomains(path: TrafficPathVO): string[] {
    return Object.keys(path?.routeMap || {});
  }

  getRoute(path: TrafficPathVO, domain: string): TopologyRouteVO {
    return (path?.routeMap || {})[domain];
  }

  /** Title shown on the LB tab: prefer the LB name, fall back to the DNS name. */
  getLbTabTitle(path: TrafficPathVO, index: number): string {
    return path?.loadBalancer?.loadBalancerName || path?.loadBalancer?.dnsName || ('LB ' + (index + 1));
  }

  /** Whether the given LB's detail panel is currently expanded. */
  isLbExpanded(path: TrafficPathVO): boolean {
    const id = path?.loadBalancer?.assetId;
    return id != null && this.lbDetailAssetId === id;
  }

  /** Click an LB: when it has an assetId, toggle/load its detail (listeners/rules) on demand. */
  onLbClick(path: TrafficPathVO) {
    const id = path?.loadBalancer?.assetId;
    if (id == null) {
      return;
    }
    // Toggle off if already expanded for this LB.
    if (this.lbDetailAssetId === id) {
      this.lbDetailAssetId = null;
      this.lbDetail = null;
      this.needDrawLines = true;
      return;
    }
    this.lbDetailAssetId = id;
    this.lbDetail = null;
    this.lbDetailLoading = true;
    this.trafficLayerService.queryServiceTopologyLoadBalancer(id)
      .pipe(finalize(() => {
        this.lbDetailLoading = false;
        this.needDrawLines = true;
      }))
      .subscribe(({ body }) => {
        this.lbDetail = body;
      });
  }

  /** Render a listener port (range or single port). */
  getListenerPort(listener: ProjectLbListenerVO): string {
    if (listener?.startPort && listener?.endPort) {
      return `${listener.startPort}-${listener.endPort}`;
    }
    return listener?.listenerPort != null ? listener.listenerPort.toString() : '';
  }

  ngAfterViewChecked(): void {
    if (this.needDrawLines && this.active) {
      this.needDrawLines = false;
      setTimeout(() => this.drawLines(), 100);
    }
  }

  ngOnDestroy(): void {
    this.removeLines();
  }

  private removeLines() {
    this.lines.forEach(l => {
      try {
        l.remove();
      } catch (e) {
      }
    });
    this.lines = [];
  }

  private drawLines() {
    this.removeLines();
    if (!this.displayPaths?.length || typeof LeaderLine === 'undefined') {
      return;
    }
    const pIdx = this.activeLbIndex;
    const dp = this.displayPaths[pIdx];
    if (!dp) {
      return;
    }
    const lbEl = document.getElementById(`k8s-topo-lb-${pIdx}`);
    if (!lbEl) {
      return;
    }
    const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--devui-brand').trim() || '#5e7ce0';
    dp.domains.forEach((domain, dIdx) => {
      const routeEl = document.getElementById(`k8s-topo-route-${pIdx}-${dIdx}`);
      if (routeEl) {
        try {
          this.lines.push(new LeaderLine(routeEl, lbEl, {
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
      }
    });
  }

}
