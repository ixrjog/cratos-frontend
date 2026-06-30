import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui/form';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ChannelRouteConfigService } from '../../../../../@core/services/channel-route-config.service';
import { ChannelInfoService } from '../../../../../@core/services/channel-info.service';
import { ApplicationService } from '../../../../../@core/services/application.service';
import { EdsService } from '../../../../../@core/services/ext-datasource.service.s';
import { map } from 'rxjs/operators';

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
              private edsService: EdsService) {
  }

  ngOnInit(): void {
    this.operationType = this.data['operationType'];
    this.formData = this.data['formData'];
    this.formGroup = new UntypedFormGroup({
      channelId: new UntypedFormControl(this.formData.channelId),
      country: new UntypedFormControl(this.formData.country),
      routeChannel: new UntypedFormControl(this.formData.routeChannel),
      applicationId: new UntypedFormControl(this.formData.applicationId),
      instanceId: new UntypedFormControl(this.formData.instanceId),
      service: new UntypedFormControl(this.formData.service),
      saveApi: new UntypedFormControl(this.formData.saveApi),
      queryApi: new UntypedFormControl(this.formData.queryApi),
      namespace: new UntypedFormControl(this.formData.namespace),
      valid: new UntypedFormControl(this.formData.valid),
      comment: new UntypedFormControl(this.formData.comment),
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

  addForm() {
    return this.channelRouteConfigService.addChannelRouteConfig(this.formGroup.value);
  }

  updateForm() {
    return this.channelRouteConfigService.updateChannelRouteConfig({ ...this.formGroup.value, id: this.formData.id });
  }

}
