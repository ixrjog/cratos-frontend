import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalNetworkComponent } from './global-network.component';
import { GlobalNetworkSubnetComponent } from './global-network-subnet/global-network-subnet.component';
import { GlobalNetworkPlanningComponent } from './global-network-planning/global-network-planning.component';
import { GlobalNetworkListComponent } from './global-network-list/global-network-list.component';
import {
  GlobalNetworkDetailsComponent
} from './global-network-list/global-network-data-table/global-network-details/global-network-details.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalNetworkComponent,
    children: [
      { path: 'list', component: GlobalNetworkListComponent },
      { path: 'details', component: GlobalNetworkDetailsComponent },
      { path: 'planning', component: GlobalNetworkPlanningComponent },
      { path: 'subnet', component: GlobalNetworkSubnetComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class GlobalNetworkRoutingModule {
}
