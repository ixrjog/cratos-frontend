import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../../@core/services/api.service';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { EdsService } from '../../../../@core/services/ext-datasource.service.s';
import { ProjectService } from '../../../../@core/services/project.service';
import { TagGroupService } from '../../../../@core/services/tag-group.service';
import { EdsAssetSshTerminalComponent } from '../../../ext-datasource/eds-instance/eds-asset/eds-asset-data-table/eds-asset-ssh-terminal/eds-asset-ssh-terminal.component';

declare var LeaderLine: any;

@Component({
  selector: 'app-tms-tenant-view',
  templateUrl: './tms-tenant-view.component.html',
  styleUrls: ['./tms-tenant-view.component.less'],
})
export class TmsTenantViewComponent implements OnInit, AfterViewChecked, OnDestroy {

  private static readonly TENANT_STORAGE_KEY = 'tms_selected_tenant';

  projectKey = 'TMS';
  activeTenant = '';
  tenantOptions: any[] = [];

  tenantView: any = null;
  loading = false;
  activeGroupName = '';
  activeLbIndex: any = 0;

  /** Service groups of the current tenant (from queryGroupsByTenantId). */
  groups: any[] = [];
  /** Assets (members) of the currently active group (from queryTagGroupAssetPage). */
  groupMembers: any[] = [];

  onLbTabChange(index: any) {
    this.activeLbIndex = index;
    this.removeLines();
    this.needDrawLines = true;
  }
  private lines: any[] = [];
  private needDrawLines = false;

  constructor(private apiService: ApiService, private edsService: EdsService, private dialogUtil: DialogUtil,
              private projectService: ProjectService, private tagGroupService: TagGroupService) {}

  ngOnInit(): void {
    this.apiService.get('/project', '/tenant/query', { projectKey: this.projectKey })
      .subscribe(({ body }: any) => {
        this.tenantOptions = body;
        const saved = localStorage.getItem(TmsTenantViewComponent.TENANT_STORAGE_KEY);
        if (saved && this.tenantOptions.some((t: any) => t.tenantCode === saved)) {
          this.activeTenant = saved;
        } else if (this.tenantOptions.length > 0) {
          this.activeTenant = this.tenantOptions[0].tenantCode;
        }
        this.fetchTenantView();
      });
  }

  ngAfterViewChecked(): void {
    if (this.needDrawLines) {
      this.needDrawLines = false;
      setTimeout(() => this.drawLines(), 100);
    }
  }

  ngOnDestroy(): void {
    this.removeLines();
  }

  onTenantChange(tenantId: string) {
    this.activeTenant = tenantId;
    localStorage.setItem(TmsTenantViewComponent.TENANT_STORAGE_KEY, tenantId);
    this.fetchTenantView();
  }

  fetchTenantView() {
    this.removeLines();
    this.loading = true;
    this.apiService.post('/project', '/tenant/view/query', {
      projectKey: this.projectKey,
      tenantCode: this.activeTenant,
    }).subscribe(({ body }: any) => {
      this.tenantView = body;
      this.loading = false;
      this.needDrawLines = true;
    });
    this.fetchGroups();
  }

  /** Load the tenant's service groups (same API as the Edit Tenant page). */
  fetchGroups() {
    this.groups = [];
    this.groupMembers = [];
    this.activeGroupName = '';
    const tenant = this.tenantOptions.find((t: any) => t.tenantCode === this.activeTenant);
    const tenantId = tenant?.id;
    if (tenantId == null) {
      return;
    }
    this.projectService.queryGroupsByTenantId(tenantId).subscribe(({ body }: any) => {
      this.groups = body || [];
      if (this.groups.length > 0) {
        this.activeGroupName = this.groups[0].name;
        this.fetchGroupMembers(this.activeGroupName);
      }
    });
  }

  onGroupChange(name: any) {
    this.activeGroupName = name;
    this.fetchGroupMembers(name);
  }

  /** Query a group's members (assets) by group name (same API as the Edit Tenant page). */
  fetchGroupMembers(groupName: string) {
    this.groupMembers = [];
    if (!groupName) {
      return;
    }
    this.tagGroupService.queryTagGroupAssetPage({
      tagGroup: groupName,
      queryName: '',
      page: 1,
      length: 200,
    } as any).subscribe(({ body }: any) => {
      this.groupMembers = body?.data || [];
    });
  }

  getListenerPort(listener: any): string {
    if (listener.startPort && listener.endPort) {
      return `${listener.startPort}-${listener.endPort}`;
    }
    return listener.listenerPort?.toString() || '';
  }

  onServerLogin(member: any) {
    this.edsService.getEdsInstanceAsset({ id: member.id || member.businessId })
      .subscribe(({ body }: any) => {
        const dialogDate = {
          ...DIALOG_DATA.editorData,
          width: '60%',
          height: '800px',
          content: EdsAssetSshTerminalComponent,
          title: 'Asset Login',
        };
        this.dialogUtil.onEditWithoutButtonDialog(UPDATE_OPERATION, dialogDate, () => null, body);
      });
  }

  private removeLines() {
    this.lines.forEach(l => { try { l.remove(); } catch (e) {} });
    this.lines = [];
  }

  private drawLines() {
    this.removeLines();
    if (!this.tenantView?.loadBalancers) return;

    const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--devui-brand').trim() || '#5e7ce0';

    this.tenantView.loadBalancers.forEach((lb: any, lbIdx: number) => {
      if (!lb.lbConfig?.routes) return;
      const dnsEl = document.getElementById(`tms-lb-dns-${lbIdx}`);
      if (!dnsEl) return;
      lb.lbConfig.routes.forEach((route: any, rIdx: number) => {
        const routeEl = document.getElementById(`tms-route-${lbIdx}-${rIdx}`);
        if (routeEl) {
          try {
            this.lines.push(new LeaderLine(routeEl, dnsEl, {
              color: lineColor + '99',
              size: 2,
              path: 'fluid',
              startSocket: 'right',
              endSocket: 'left',
              startPlug: 'behind',
              endPlug: 'arrow1',
            }));
          } catch (e) {}
        }
      });
    });
  }
}
