import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EdsService } from '../../../@core/services/ext-datasource.service.s';
import { EdsAssetVO, EdsInstanceVO } from '../../../@core/data/ext-datasource';
import { AceEditorComponent } from '../../../@shared/components/common/ace-editor/ace-editor.component';
import { TOAST_CONTENT, ToastUtil } from '../../../@shared/utils/toast.util';

@Component({
  selector: 'app-traffic-layer-alb-config',
  templateUrl: './traffic-layer-alb-config.component.html',
  styleUrls: ['./traffic-layer-alb-config.component.less'],
})
export class TrafficLayerAlbConfigComponent implements OnInit {

  /** Only ALIYUN data source instances are relevant for ALB config. */
  private static readonly EDS_TYPE = 'ALIYUN';
  /** Kubernetes instances are filtered to ACK ones (version contains "aliyun"). */
  private static readonly K8S_EDS_TYPE = 'KUBERNETES';
  private static readonly K8S_VERSION_KEYWORD = 'aliyun';
  /** Aliyun ALB asset type. */
  private static readonly ALB_ASSET_TYPE = 'ALIYUN_ALB';
  /**
   * ALB resource name validation (RFC 1123 DNS subdomain style, anchored).
   * Lowercase letters/digits, '-' allowed only in the middle, '.'-separated labels.
   */
  private static readonly ALB_NAME_PATTERN =
    /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
  private static readonly INSTANCE_STORAGE_KEY = 'traffic_layer_alb_selected_instance';
  private static readonly K8S_INSTANCE_STORAGE_KEY = 'traffic_layer_alb_selected_k8s_instance';

  loading = false;
  instances: EdsInstanceVO[] = [];
  activeInstanceId: any = null;

  k8sLoading = false;
  k8sInstances: EdsInstanceVO[] = [];
  activeK8sInstanceId: any = null;

  selectedAlbAsset: EdsAssetVO = null;

  /** Editable ALB resource name injected into the config templates. */
  albName = '';

  /** True when albName is non-empty and matches the ALB naming rule. */
  get albNameValid(): boolean {
    return TrafficLayerAlbConfigComponent.ALB_NAME_PATTERN.test(this.albName);
  }

  // Resource configuration (AlbConfig / IngressClass)
  configType: any = 'AlbConfig';
  // TLS security policies selectable for AlbConfig listeners.
  readonly tlsPolicies = [
    'tls_cipher_policy_1_2',
    'tls_cipher_policy_1_2_strict',
    'tls_cipher_policy_1_2_strict_with_1_3',
  ];
  tlsPolicy: any = 'tls_cipher_policy_1_2_strict_with_1_3';
  albConfigYaml = this.buildAlbConfigYaml();
  ingressClassYaml = this.buildIngressClassYaml();

  @ViewChild('albConfigEditor') private albConfigEditor: AceEditorComponent;
  @ViewChild('ingressClassEditor') private ingressClassEditor: AceEditorComponent;

  creatingAlbConfig = false;
  creatingIngressClass = false;

  constructor(private edsService: EdsService, private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.fetchInstances();
    this.fetchK8sInstances();
  }

  fetchInstances() {
    this.loading = true;
    this.edsService.queryEdsInstancePage({
      queryName: '',
      edsType: TrafficLayerAlbConfigComponent.EDS_TYPE,
      page: 1,
      length: 100,
    }).subscribe({
      next: ({ body }) => {
        this.instances = body?.data || [];
        this.activeInstanceId = this.restoreActive(
          this.instances, TrafficLayerAlbConfigComponent.INSTANCE_STORAGE_KEY);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  fetchK8sInstances() {
    this.k8sLoading = true;
    this.edsService.queryEdsInstancePage({
      queryName: '',
      edsType: TrafficLayerAlbConfigComponent.K8S_EDS_TYPE,
      page: 1,
      length: 100,
    }).subscribe({
      next: ({ body }) => {
        const keyword = TrafficLayerAlbConfigComponent.K8S_VERSION_KEYWORD;
        // 只展示版本中含 "aliyun" 的 Kubernetes 实例(ACK)
        this.k8sInstances = (body?.data || [])
          .filter(i => (i.version || '').toLowerCase().includes(keyword));
        this.activeK8sInstanceId = this.restoreActive(
          this.k8sInstances, TrafficLayerAlbConfigComponent.K8S_INSTANCE_STORAGE_KEY);
        this.k8sLoading = false;
      },
      error: () => {
        this.k8sLoading = false;
      },
    });
  }

  /** Server-side search of ALB assets under the selected ALIYUN instance (by name). */
  onSearchAlbAsset = (term: string): Observable<{ id: any; option: EdsAssetVO }[]> => {
    if (this.activeInstanceId == null) {
      return of([]);
    }
    return this.edsService.queryEdsInstanceAssetPage({
      instanceId: this.activeInstanceId,
      assetType: TrafficLayerAlbConfigComponent.ALB_ASSET_TYPE,
      queryName: term || '',
      valid: true,
      page: 1,
      length: 20,
    }).pipe(
      map(({ body }) => (body?.data || []).map((a, index) => ({ id: index, option: a }))),
    );
  };

  /** Clear the selected ALB and reset both YAML templates. */
  private resetAlbSelection() {
    this.selectedAlbAsset = null;
    this.albName = '';
    this.albConfigYaml = this.buildAlbConfigYaml();
    this.ingressClassYaml = this.buildIngressClassYaml();
    setTimeout(() => {
      this.albConfigEditor?.onWrite(this.albConfigYaml);
      this.ingressClassEditor?.onWrite(this.ingressClassYaml);
    }, 0);
  }

  onInstanceChange(id: any) {
    this.activeInstanceId = id;
    this.persist(TrafficLayerAlbConfigComponent.INSTANCE_STORAGE_KEY, id);
    this.resetAlbSelection();
  }

  onK8sInstanceChange(id: any) {
    this.activeK8sInstanceId = id;
    this.persist(TrafficLayerAlbConfigComponent.K8S_INSTANCE_STORAGE_KEY, id);
  }

  onConfigTypeChange(type: any) {
    this.configType = type;
  }

  /** Switch the TLS security policy and re-inject it into the AlbConfig YAML. */
  onTlsPolicyChange(policy: any) {
    this.tlsPolicy = policy;
    this.albConfigYaml = this.buildAlbConfigYaml(this.albName, this.selectedAlbAsset?.assetId);
    setTimeout(() => this.albConfigEditor?.onWrite(this.albConfigYaml), 0);
  }

  /** Create the AlbConfig custom resource on the selected Kubernetes (ACK) instance. */
  onCreateAlbConfig() {
    this.createCustomResource('AlbConfig');
  }

  /** Create the IngressClass on the selected Kubernetes (ACK) instance. */
  onCreateIngressClass() {
    this.createCustomResource('IngressClass');
  }

  private createCustomResource(type: 'AlbConfig' | 'IngressClass') {
    if (this.activeK8sInstanceId == null) {
      this.toastUtil.onErrorToast('Please select a Kubernetes (ACK) instance');
      return;
    }
    if (!this.albNameValid) {
      this.toastUtil.onErrorToast('Invalid ALB name');
      return;
    }
    const content = type === 'AlbConfig' ? this.albConfigYaml : this.ingressClassYaml;
    if (!content || !content.trim()) {
      this.toastUtil.onErrorToast('Resource content is empty');
      return;
    }
    const param = { instanceId: this.activeK8sInstanceId, content };
    const request$ = type === 'AlbConfig'
      ? this.edsService.createKubernetesAlbConfig(param)
      : this.edsService.createKubernetesIngressClass(param);
    if (type === 'AlbConfig') {
      this.creatingAlbConfig = true;
    } else {
      this.creatingIngressClass = true;
    }
    request$.subscribe({
      next: () => {
        this.toastUtil.onSuccessToast(TOAST_CONTENT.CREATE);
        this.clearCreating(type);
      },
      error: () => {
        this.clearCreating(type);
      },
    });
  }

  private clearCreating(type: 'AlbConfig' | 'IngressClass') {
    if (type === 'AlbConfig') {
      this.creatingAlbConfig = false;
    } else {
      this.creatingIngressClass = false;
    }
  }

  /** Inject the selected ALB into both config templates (name + assetId). */
  onAlbSelect(asset: EdsAssetVO) {
    // Pre-fill the editable name from the selected ALB; user may edit it afterwards.
    // ALB asset names may contain '_', which is invalid for the resource name,
    // so default to converting '_' -> '-'.
    this.albName = (asset?.name || '').replace(/_/g, '-');
    this.injectAlbIntoConfigs();
  }

  /** Re-inject the (possibly user-edited) ALB name into both config templates. */
  onAlbNameChange() {
    this.injectAlbIntoConfigs();
  }

  /** Rebuild both YAML templates from the current albName + selected ALB id and push to editors. */
  private injectAlbIntoConfigs() {
    this.albConfigYaml = this.buildAlbConfigYaml(this.albName, this.selectedAlbAsset?.assetId);
    this.ingressClassYaml = this.buildIngressClassYaml(this.albName);
    // ace-editor reads aceValue only on init; push into whichever editor is currently rendered.
    setTimeout(() => {
      this.albConfigEditor?.onWrite(this.albConfigYaml);
      this.ingressClassEditor?.onWrite(this.ingressClassYaml);
    }, 0);
  }

  /** AlbConfig YAML template with the ALB name / id injected (empty when none selected). */
  private buildAlbConfigYaml(name?: string, id?: string): string {
    return `apiVersion: alibabacloud.com/v1
kind: AlbConfig
metadata:
  name: ${name || ''}
spec:
  config:
    id: ${id || ''}
    forceOverride: false
    listenerForceOverride: false
  listeners:
    - port: 443
      protocol: HTTPS
      securityPolicyId: ${this.tlsPolicy}
`;
  }

  /** IngressClass YAML template with the ALB name injected into metadata.name and spec.parameters.name. */
  private buildIngressClassYaml(name?: string): string {
    return `apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: ${name || ''}
spec:
  controller: ingress.k8s.alibabacloud/alb
  parameters:
    apiGroup: alibabacloud.com
    kind: AlbConfig
    name: ${name || ''}
    scope: Cluster
`;
  }

  get activeInstance(): EdsInstanceVO {
    return this.instances.find(i => i.id === this.activeInstanceId);
  }

  get activeK8sInstance(): EdsInstanceVO {
    return this.k8sInstances.find(i => i.id === this.activeK8sInstanceId);
  }

  /** Keep the last selected instance across visits, falling back to the first one. */
  private restoreActive(instances: EdsInstanceVO[], storageKey: string): any {
    const saved = localStorage.getItem(storageKey);
    const savedId = saved ? Number(saved) : null;
    if (savedId != null && instances.some(i => i.id === savedId)) {
      return savedId;
    }
    return instances.length > 0 ? instances[0].id : null;
  }

  private persist(storageKey: string, id: any) {
    localStorage.setItem(storageKey, id != null ? String(id) : '');
  }

}
