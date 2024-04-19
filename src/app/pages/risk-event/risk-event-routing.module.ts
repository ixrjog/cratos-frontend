import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtDatasourceComponent } from '../ext-datasource/ext-datasource.component';
import { RiskEventListComponent } from './risk-event-list/risk-event-list.component';
import { RiskEventDetailComponent } from './risk-event-detail/risk-event-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ExtDatasourceComponent,
    children: [
      { path: 'list', component: RiskEventListComponent },
      { path: 'detail', component: RiskEventDetailComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class RiskEventRoutingModule {
}
