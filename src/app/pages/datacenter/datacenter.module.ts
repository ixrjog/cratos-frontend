import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatacenterRoutingModule } from './datacenter-routing.module';
import { DatacenterComponent } from './datacenter.component';
import { DatacenterNetworkComponent } from './datacenter-network/datacenter-network.component';
import { DatacenterNetworkDataTableComponent } from './datacenter-network/datacenter-network-data-table/datacenter-network-data-table.component';
import { DatacenterNetworkEditorComponent } from './datacenter-network/datacenter-network-data-table/datacenter-network-editor/datacenter-network-editor.component';
import { DatacenterAllocationComponent } from './datacenter-allocation/datacenter-allocation.component';
import { DatacenterAllocationDataTableComponent } from './datacenter-allocation/datacenter-allocation-data-table/datacenter-allocation-data-table.component';
import { DatacenterAllocationEditorComponent } from './datacenter-allocation/datacenter-allocation-data-table/datacenter-allocation-editor/datacenter-allocation-editor.component';
import { DatacenterAllocationFindCidrComponent } from './datacenter-allocation/datacenter-allocation-data-table/datacenter-allocation-find-cidr/datacenter-allocation-find-cidr.component';
import { DatacenterSubnetMapComponent } from './datacenter-subnet-map/datacenter-subnet-map.component';
import { SubnetBlockDetailComponent } from './datacenter-subnet-map/subnet-block-detail/subnet-block-detail.component';
import { SubnetDrillComponent } from './datacenter-subnet-map/subnet-drill/subnet-drill.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../@shared/shared.module';
import { DataTableModule } from 'ng-devui/data-table';
import { LoadingModule, PaginationModule } from 'ng-devui';

@NgModule({
  declarations: [
    DatacenterComponent,
    DatacenterNetworkComponent,
    DatacenterNetworkDataTableComponent,
    DatacenterNetworkEditorComponent,
    DatacenterAllocationComponent,
    DatacenterAllocationDataTableComponent,
    DatacenterAllocationEditorComponent,
    DatacenterAllocationFindCidrComponent,
    DatacenterSubnetMapComponent,
    SubnetBlockDetailComponent,
    SubnetDrillComponent,
  ],
  imports: [
    CommonModule,
    DatacenterRoutingModule,
    DaGridModule,
    TranslateModule,
    SharedModule,
    DataTableModule,
    LoadingModule,
    PaginationModule,
  ],
})
export class DatacenterModule {
}
