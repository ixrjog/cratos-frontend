import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelComponent } from './channel.component';
import { OrganizationListComponent } from './organization/organization-list/organization-list.component';
import { ChannelNetworkListComponent } from '../channel-network/channel-network-list/channel-network-list.component';

const routes: Routes = [
  {
    path: '',
    component: ChannelComponent,
    children: [
      { path: 'organization', component: OrganizationListComponent },
      { path: 'network', component: ChannelNetworkListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelRoutingModule {
}
