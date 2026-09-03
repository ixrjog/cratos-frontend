import { AfterViewInit, Component } from '@angular/core';
import { EdsService } from '../../../../@core/services/ext-datasource.service.s';
import { ActivatedRoute } from '@angular/router';
import { EdsInstanceVO } from '../../../../@core/data/ext-datasource';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-eds-asset',
  templateUrl: './eds-asset.component.html',
  styleUrls: [ './eds-asset.component.less' ],
})
export class EdsAssetComponent implements AfterViewInit {

  instanceId: number = null;
  edsInstance: EdsInstanceVO;
  instanceAssetTypes: { type: string, displayName: string }[] = [];
  assetType: string;
  tabActiveId: string | number = '';
  loading: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private edsService: EdsService,
  ) {
  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {
      this.instanceId = param['instanceId'];
      if (this.instanceId) {
        this.getEdsInstanceById();
      }
    });
  }

  getEdsInstanceById() {
    this.loading = true;
    this.edsService.getEdsInstanceById({ instanceId: this.instanceId })
      .pipe(
        finalize(() => this.loading = false),
      )
      .subscribe(({ body }) => {
        this.edsInstance = body;
        this.instanceAssetTypes = body.instanceAssetTypes;
        // 恢复上次选中的资产类型(需仍存在于当前列表), 否则默认第一个
        const savedType = this.restoreAssetType();
        const valid = savedType && this.instanceAssetTypes.some(t => t.type === savedType);
        const target = valid ? savedType : this.instanceAssetTypes[0].type;
        this.assetType = target;
        this.tabActiveId = target;
      });
  }

  /** 资产类型持久化 key(按实例区分) */
  private get assetTypeStorageKey(): string {
    return `eds-asset-active-type:${this.instanceId}`;
  }

  private restoreAssetType(): string | null {
    try {
      return localStorage.getItem(this.assetTypeStorageKey);
    } catch (e) {
      return null;
    }
  }

  private persistAssetType(type: string): void {
    try {
      localStorage.setItem(this.assetTypeStorageKey, type);
    } catch (e) {
      // 忽略 localStorage 异常
    }
  }

  onActiveTabChange(tab) {
    this.assetType = tab;
    this.persistAssetType(tab);
  }

  protected readonly JSON = JSON;
}
