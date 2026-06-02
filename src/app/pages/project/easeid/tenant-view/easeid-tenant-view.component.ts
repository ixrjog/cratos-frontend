import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../../@core/services/api.service';
import { DIALOG_DATA, DialogUtil, UPDATE_OPERATION } from '../../../../@shared/utils/dialog.util';
import { EdsService } from '../../../../@core/services/ext-datasource.service.s';
import { EdsAssetSshTerminalComponent } from '../../../ext-datasource/eds-instance/eds-asset/eds-asset-data-table/eds-asset-ssh-terminal/eds-asset-ssh-terminal.component';

declare var LeaderLine: any;

@Component({
  selector: 'app-easeid-tenant-view',
  templateUrl: './easeid-tenant-view.component.html',
  styleUrls: ['./easeid-tenant-view.component.less'],
})
export class EaseidTenantViewComponent implements OnInit, AfterViewChecked, OnDestroy {

  private static readonly TENANT_STORAGE_KEY = 'easeid_selected_tenant';

  projectKey = 'EaseID';
  activeTenant = '';
  tenantOptions: any[] = [];

  tenantView: any = null;
  loading = false;
  private lines: any[] = [];
  private needDrawLines = false;

  constructor(private apiService: ApiService, private edsService: EdsService, private dialogUtil: DialogUtil) {}

  ngOnInit(): void {
    this.apiService.get('/project', '/tenant/query', { projectKey: this.projectKey })
      .subscribe(({ body }: any) => {
        this.tenantOptions = body;
        const saved = localStorage.getItem(EaseidTenantViewComponent.TENANT_STORAGE_KEY);
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
    localStorage.setItem(EaseidTenantViewComponent.TENANT_STORAGE_KEY, tenantId);
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
  }

  getListenerPort(listener: any): string {
    if (listener.startPort && listener.endPort) {
      return `${listener.startPort}-${listener.endPort}`;
    }
    return listener.listenerPort?.toString() || '';
  }

  onServerLogin(member: any) {
    this.edsService.getEdsInstanceAsset({ id: member.businessId })
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
      const dnsEl = document.getElementById(`lb-dns-${lbIdx}`);
      if (!dnsEl) return;
      lb.lbConfig.routes.forEach((route: any, rIdx: number) => {
        const routeEl = document.getElementById(`route-${lbIdx}-${rIdx}`);
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
