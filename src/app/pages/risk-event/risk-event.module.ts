import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskEventRoutingModule } from './risk-event-routing.module';
import { RiskEventComponent } from './risk-event.component';
import { RiskEventListComponent } from './risk-event-list/risk-event-list.component';
import { RiskEventCardListComponent } from './risk-event-list/risk-event-card-list/risk-event-card-list.component';
import { SharedModule } from '../../@shared/shared.module';
import { RiskEventCardComponent } from './risk-event-list/risk-event-card-list/risk-event-card/risk-event-card.component';
import { RiskEventEditorComponent } from './risk-event-list/risk-event-card-list/risk-event-editor/risk-event-editor.component';
import { RiskEventImpactComponent } from './risk-event-list/risk-event-card-list/risk-event-card/risk-event-impact/risk-event-impact.component';
import {
  RiskEventImpactEditorComponent
} from './risk-event-list/risk-event-card-list/risk-event-impact-editor/risk-event-impact-editor.component';
import { RiskEventReportComponent } from './risk-event-report/risk-event-report.component';
import { RiskEventChartComponent } from './risk-event-report/risk-event-chart/risk-event-chart.component';
import { RiskEventPieChartComponent } from './risk-event-report/risk-event-chart/risk-event-pie-chart/risk-event-pie-chart.component';
import { RiskEventImpactBarChartComponent } from './risk-event-report/risk-event-chart/risk-event-impact-bar-chart/risk-event-impact-bar-chart.component';

@NgModule({
  declarations: [
    RiskEventComponent,
    RiskEventListComponent,
    RiskEventCardListComponent,
    RiskEventCardComponent,
    RiskEventEditorComponent,
    RiskEventImpactEditorComponent,
    RiskEventImpactComponent,
    RiskEventReportComponent,
    RiskEventChartComponent,
    RiskEventPieChartComponent,
    RiskEventImpactBarChartComponent,
  ],
  imports: [
    CommonModule,
    RiskEventRoutingModule,
    SharedModule,
  ],
})
export class RiskEventModule { }
