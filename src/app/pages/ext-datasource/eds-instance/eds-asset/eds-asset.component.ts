import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { EdsService } from '../../../../@core/services/ext-datasource.service.s';
import { ActivatedRoute } from '@angular/router';
import { EdsInstanceVO } from '../../../../@core/data/ext-datasource';
import { finalize } from 'rxjs';
import { EdsAssetDataTableComponent } from './eds-asset-data-table/eds-asset-data-table.component';

@Component({
  selector: 'app-eds-asset',
  templateUrl: './eds-asset.component.html',
  styleUrls: [ './eds-asset.component.less' ],
})
export class EdsAssetComponent implements AfterViewInit {

  @ViewChild('edsAssetDataTable') private edsAssetDataTable: EdsAssetDataTableComponent;
  instanceId: number = null;
  edsInstance: EdsInstanceVO;
  assetTypes: string[];
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
        this.assetTypes = body.assetTypes;
        this.assetType = this.assetTypes[0];
        this.tabActiveId = this.assetTypes[0];
      });
  }

  onActiveTabChange(tab) {
    this.assetType = tab;
  }

  protected readonly JSON = JSON;
}
