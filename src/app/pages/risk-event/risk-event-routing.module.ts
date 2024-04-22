import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtDatasourceComponent } from '../ext-datasource/ext-datasource.component';
import { RiskEventListComponent } from './risk-event-list/risk-event-list.component';

const routes: Routes = [
  {
    path: '',
    component: ExtDatasourceComponent,
    children: [
      { path: 'list', component: RiskEventListComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class RiskEventRoutingModule {
}
