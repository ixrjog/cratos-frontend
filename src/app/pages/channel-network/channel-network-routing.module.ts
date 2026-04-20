import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelNetworkComponent } from './channel-network.component';

const routes: Routes = [
  {
    path: '',
    component: ChannelNetworkComponent,
    children: [
      { path: 'list', redirectTo: '/pages/channel/network', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ChannelNetworkRoutingModule {
}
