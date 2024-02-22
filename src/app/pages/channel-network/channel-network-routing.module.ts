import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelNetworkComponent } from './channel-network.component';
import { ChannelNetworkListComponent } from './channel-network-list/channel-network-list.component';

const routes: Routes = [
  {
    path: '',
    component: ChannelNetworkComponent,
    children: [
      { path: 'list', component: ChannelNetworkListComponent },
    ],
  },
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ChannelNetworkRoutingModule {
}
