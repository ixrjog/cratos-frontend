import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatacenterComponent } from './datacenter.component';
import { DatacenterNetworkComponent } from './datacenter-network/datacenter-network.component';
import { DatacenterAllocationComponent } from './datacenter-allocation/datacenter-allocation.component';

const routes: Routes = [
  {
    path: '',
    component: DatacenterComponent,
    children: [
      { path: 'network', component: DatacenterNetworkComponent },
      { path: 'allocation', component: DatacenterAllocationComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatacenterRoutingModule {
}
