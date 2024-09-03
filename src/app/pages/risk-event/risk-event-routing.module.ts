import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskEventListComponent } from './risk-event-list/risk-event-list.component';
import { RiskEventReportComponent } from './risk-event-report/risk-event-report.component';
import { RiskEventComponent } from './risk-event.component';

const routes: Routes = [
  {
    path: '',
    component: RiskEventComponent,
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
