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

  /** 这些 Name 的 Value 按各自分隔符分行展示 */
  private static readonly MULTILINE_DELIMITERS: { [name: string]: string } = {
    'ldap.group.members': ';',
    'ldap.user.groups': ';',
    'cloud.access.key.ids': ',',
    'ram.users': ',',
    'iam.policies': ',',
    'gcp.member.roles': ',',
    'azure.directory.roles': ',',
  };

  isMultiValue(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(EdsAssetIndexDataTableComponent.MULTILINE_DELIMITERS, name);
  }

  splitValue(name: string, value: string): string[] {
    if (!value) {
      return [];
    }
    const delimiter = EdsAssetIndexDataTableComponent.MULTILINE_DELIMITERS[name] || ';';
    return value.split(delimiter)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (JSON.stringify(this.dataTable) !== '[]') {
      this.loading = false;
    } else {
      this.loading = true;
    }
  }
}
