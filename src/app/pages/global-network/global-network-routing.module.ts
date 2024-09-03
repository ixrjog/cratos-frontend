import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalNetworkComponent } from './global-network.component';
import { GlobalNetworkSubnetComponent } from './global-network-subnet/global-network-subnet.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalNetworkComponent,
    children: [
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
