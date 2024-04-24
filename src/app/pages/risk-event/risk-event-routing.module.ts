import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtDatasourceComponent } from '../ext-datasource/ext-datasource.component';
import { RiskEventListComponent } from './risk-event-list/risk-event-list.component';
import { RiskEventReportComponent } from './risk-event-report/risk-event-report.component';

const routes: Routes = [
  {
    path: '',
    component: ExtDatasourceComponent,
    children: [
      { path: 'list', component: RiskEventListComponent },
      { path: 'report', component: RiskEventReportComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class RiskEventRoutingModule {
}
