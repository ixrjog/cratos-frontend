import { Component, ViewChild } from '@angular/core';
import { RbacResourceDataTableComponent } from './rbac-resource-data-table/rbac-resource-data-table.component';
import { RbacGroupDataTableComponent } from './rbac-group-data-table/rbac-group-data-table.component';

@Component({
  selector: 'app-rbac-resource',
  templateUrl: './rbac-resource.component.html',
  styleUrls: [ './rbac-resource.component.less' ],
})
export class RbacResourceComponent {

  @ViewChild('rbacResourceDataTable') private rbacResourceDataTable: RbacResourceDataTableComponent;
  @ViewChild('rbacGroupDataTable') private rbacGroupDataTable: RbacGroupDataTableComponent;

  tabActiveId: string | number = 'resource';

  constructor() {
  }

  onActiveTabChange(tab) {
    switch (tab) {
      case 'resource':
        this.rbacResourceDataTable.fetchData();
        break;
      case 'group':
        this.rbacGroupDataTable.fetchData();
        break;
      default:
        break;
    }
  }

}
