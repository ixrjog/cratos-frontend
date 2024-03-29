import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EdsAssetIndexVO } from '../../../../../../@core/data/ext-datasource';

@Component({
  selector: 'app-eds-asset-index-data-table',
  templateUrl: './eds-asset-index-data-table.component.html',
  styleUrls: [ './eds-asset-index-data-table.component.less' ],
})
export class EdsAssetIndexDataTableComponent implements OnChanges {
  @Input() dataTable: EdsAssetIndexVO[];
  loading = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (JSON.stringify(this.dataTable) !== '[]') {
      this.loading = false;
    } else {
      this.loading = true;
    }
  }
}
