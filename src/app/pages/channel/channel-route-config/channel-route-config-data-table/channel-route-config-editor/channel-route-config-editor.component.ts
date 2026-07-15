import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui/form';
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ChannelRouteConfigService } from '../../../../../@core/services/channel-route-config.service';
import { ChannelInfoService } from '../../../../../@core/services/channel-info.service';
import { ApplicationService } from '../../../../../@core/services/application.service';
import { EdsService } from '../../../../../@core/services/ext-datasource.service.s';
import { map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ToastUtil } from '../../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-channel-route-config-editor',
  templateUrl: './channel-route-config-editor.component.html',
  styleUrls: ['./channel-route-config-editor.component.less'],
})
export class ChannelRouteConfigEditorComponent implements OnInit {

  @ViewChild('editorForm') formDir: DFormGroupRuleDirective;
  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  formData: any;
  formGroup: FormGroup;
  operationType: boolean;

  /** Currently selected channel object (bound to the search select). */
  selectedChannel: any;
  /** Currently selected application object (bound to the search select). */
  selectedApplication: any;
  /** Namespace options for the selected application (same source as the k8s env tab). */
  namespaceOptions: any[] = [];
  /** Currently active namespace tab (kept in sync with the form control). */
  activeNamespace: string;
  /** KUBERNETES EDS instance options (tab style). */
  kubernetesInstanceOptions: any[] = [];
  /** Currently active kubernetes instance id (kept in sync with the form control). */
  activeInstanceId: any;

  /** Default selections applied only when creating a new config. */
  private static readonly DEFAULT_INSTANCE_LABEL = 'ACK-CHANNEL-PROD';
  private static readonly DEFAULT_NAMESPACE = 'prod';
  /** Track the last auto-generated API values so manual edits are preserved. */
  private lastAutoSaveApi = '';
  private lastAutoQueryApi = '';

  /** Remote search for channels, mapped to devui select's {id, option} shape. */
  onSearchChannel = (term: string) => {
    return this.channelInfoService.queryChannelPage({ queryName: term, country: '', page: 1, length: 20 })
      .pipe(
        map(({ body }) => (body.data || []).map(channel => ({ id: channel.id, option: channel }))),
      );
  };

  /** Remote search for applications, mapped to devui select's {id, option} shape. */
  onSearchApplication = (term: string) => {
    return this.applicationService.queryApplicationPage({ queryName: term, page: 1, length: 20 })
      .pipe(
        map(({ body }) => (body.data || []).map(application => ({ id: application.id, option: application }))),
      );
  };

  constructor(private channelRouteConfigService: ChannelRouteConfigService,
              private channelInfoService: ChannelInfoService,
              private applicationService: ApplicationService,
              private edsService: EdsService,
              private toastUtil: ToastUtil) {
  }

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.formGroup = new UntypedFormGroup({
      channelId: new UntypedFormControl(this.formData.channelId, Validators.required),
      country: new UntypedFormControl(this.formData.country, Validators.required),
      routeChannel: new UntypedFormControl(this.formData.routeChannel, Validators.required),
      applicationId: new UntypedFormControl(this.formData.applicationId, Validators.required),
      instanceId: new UntypedFormControl(this.formData.instanceId, Validators.required),
      service: new UntypedFormControl(this.formData.service, Validators.required),
      saveApi: new UntypedFormControl(this.formData.saveApi, Validators.required),
      queryApi: new UntypedFormControl(this.formData.queryApi, Validators.required),
      namespace: new UntypedFormControl(this.formData.namespace, Validators.required),
      valid: new UntypedFormControl(this.formData.valid),
      comment: new UntypedFormControl(this.formData.comment),
    });
    // Auto-fill Save/Query API from Route Channel (lowercased) while preserving manual edits.
    this.formGroup.get('routeChannel').valueChanges.subscribe((routeChannel: string) => {
      this.applyApiDefaults(routeChannel);
    });
    // Pre-select the channel / application in edit mode when the VO already carries them.
    if (this.formData.channel) {
      this.selectedChannel = this.formData.channel;
    }
    if (this.formData.application) {
      this.selectedApplication = this.formData.application;
      this.loadNamespaceOptions(this.formData.application.name);
    }
    this.activeNamespace = this.formData.namespace;
    this.activeInstanceId = this.formData.instanceId;
    this.loadKubernetesInstances();
  }

  /** Load KUBERNETES EDS instances (same data source as the eds/instance page). */
  private loadKubernetesInstances() {
    this.edsService.queryEdsInstancePage({ queryName: '', edsType: 'KUBERNETES', page: 1, length: 1000 })
      .subscribe(({ body }) => {
        this.kubernetesInstanceOptions = (body.data || []).map(instance => ({
          label: instance.instanceName,
          value: instance.id,
        }));
        // When creating a new config, default-select the ACK-CHANNEL-PROD instance.
        if (this.operationType && !this.formGroup.get('instanceId').value) {
          const defaultInstance = this.kubernetesInstanceOptions.find(
            opt => opt.label === ChannelRouteConfigEditorComponent.DEFAULT_INSTANCE_LABEL);
          if (defaultInstance) {
            this.activeInstanceId = defaultInstance.value;
            this.formGroup.patchValue({ instanceId: defaultInstance.value });
          }
        }
      });
  }

  onInstanceTabChange(id: any) {
    this.activeInstanceId = id;
    this.formGroup.patchValue({ instanceId: id });
  }

  /** Load the application's resource namespaces (same source as the k8s env tab). */
  private loadNamespaceOptions(applicationName: string) {
    if (!applicationName) {
      this.namespaceOptions = [];
      return;
    }
    this.applicationService.getMyResourceNamespaceOptions({ applicationName })
      .subscribe(({ body }) => {
        this.namespaceOptions = body.options || [];
        // When creating a new config, default-select the "prod" namespace if available.
        if (this.operationType && !this.formGroup.get('namespace').value) {
          const defaultNamespace = this.namespaceOptions.find(
            opt => opt.value === ChannelRouteConfigEditorComponent.DEFAULT_NAMESPACE
              || opt.label === ChannelRouteConfigEditorComponent.DEFAULT_NAMESPACE);
          if (defaultNamespace) {
            this.activeNamespace = defaultNamespace.value;
            this.formGroup.patchValue({ namespace: defaultNamespace.value });
          }
        }
      });
  }

  onNamespaceTabChange(tab: any) {
    this.activeNamespace = tab;
    this.formGroup.patchValue({ namespace: tab });
  }

  onChannelChange(channel: any) {
    this.selectedChannel = channel;
    this.formGroup.patchValue({ channelId: channel?.id, country: channel?.country });
  }

  onApplicationChange(application: any) {
    this.selectedApplication = application;
    this.formGroup.patchValue({ applicationId: application?.id, service: application?.name });
    // Reload namespace options for the newly selected application.
    this.namespaceOptions = [];
    this.activeNamespace = null;
    this.formGroup.patchValue({ namespace: null });
    this.loadNamespaceOptions(application?.name);
  }

  /**
   * Derive Save/Query API from the Route Channel (lowercased):
   *   /{routeChannel}/config/save  and  /{routeChannel}/config/query
   * Only overwrites a field when it is empty or still holds the previously auto-filled value,
   * so a manual edit by the user is preserved.
   */
  private applyApiDefaults(routeChannel: string) {
    const rc = (routeChannel || '').trim().toLowerCase();
    const save = rc ? `/${rc}/config/save` : '';
    const query = rc ? `/${rc}/config/query` : '';
    const currentSave = this.formGroup.get('saveApi').value;
    const currentQuery = this.formGroup.get('queryApi').value;
    if (!currentSave || currentSave === this.lastAutoSaveApi) {
      this.formGroup.patchValue({ saveApi: save });
    }
    if (!currentQuery || currentQuery === this.lastAutoQueryApi) {
      this.formGroup.patchValue({ queryApi: query });
    }
    this.lastAutoSaveApi = save;
    this.lastAutoQueryApi = query;
  }

  /** Validate the form; on failure, mark controls as touched and toast a message. */
  private validateForm(): boolean {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.toastUtil.onCommonToast('Please complete all required fields');
      return false;
    }
    return true;
  }

  addForm() {
    if (!this.validateForm()) {
      return EMPTY;
    }
    return this.channelRouteConfigService.addChannelRouteConfig(this.formGroup.value);
  }

  updateForm() {
    if (!this.validateForm()) {
      return EMPTY;
    }
    return this.channelRouteConfigService.updateChannelRouteConfig({ ...this.formGroup.value, id: this.formData.id });
  }

}
