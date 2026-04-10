import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatacenterComponent } from './datacenter.component';
import { DatacenterNetworkComponent } from './datacenter-network/datacenter-network.component';
import { DatacenterAllocationComponent } from './datacenter-allocation/datacenter-allocation.component';
import { DatacenterSubnetMapComponent } from './datacenter-subnet-map/datacenter-subnet-map.component';

const routes: Routes = [
  {
    path: '',
    component: DatacenterComponent,
    children: [
      { path: 'network', component: DatacenterNetworkComponent },
      { path: 'allocation', component: DatacenterAllocationComponent },
      { path: 'subnet-map', component: DatacenterSubnetMapComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatacenterRoutingModule {
}
