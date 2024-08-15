import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RbacComponent } from '../rbac/rbac.component';
import { TrafficLayerDomainComponent } from './traffic-layer-domain/traffic-layer-domain.component';
import { TrafficLayerRecordComponent } from './traffic-layer-record/traffic-layer-record.component';
import { TrafficLayerIngressComponent } from './traffic-layer-ingress/traffic-layer-ingress.component';

const routes: Routes = [
  {
    path: '',
    component: RbacComponent,
    children: [
      { path: 'domain', component: TrafficLayerDomainComponent },
      { path: 'record-details', component: TrafficLayerRecordComponent },
      { path: 'ingress-details', component: TrafficLayerIngressComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class TrafficLayerRoutingModule {
}
