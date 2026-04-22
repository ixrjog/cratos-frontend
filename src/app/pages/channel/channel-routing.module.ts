import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelComponent } from './channel.component';
import { OrganizationListComponent } from './organization/organization-list/organization-list.component';
import { ChannelNetworkListComponent } from '../channel-network/channel-network-list/channel-network-list.component';
import { ChannelInfoListComponent } from './channel-info/channel-info-list/channel-info-list.component';
import { ChannelBusinessListComponent } from './channel-business/channel-business-list/channel-business-list.component';
import { ChannelLineListComponent } from './channel-line/channel-line-list/channel-line-list.component';
import { ChannelViewComponent } from './channel-view/channel-view.component';

const routes: Routes = [
  {
    path: '',
    component: ChannelComponent,
    children: [
      { path: 'organization', component: OrganizationListComponent },
      { path: 'network', component: ChannelNetworkListComponent },
      { path: 'info', component: ChannelInfoListComponent },
      { path: 'business', component: ChannelBusinessListComponent },
      { path: 'line', component: ChannelLineListComponent },
      { path: 'view', component: ChannelViewComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelRoutingModule {
}
