import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventPieChartComponent } from './risk-event-pie-chart.component';

describe('RiskEventPieChartComponent', () => {
  let component: RiskEventPieChartComponent;
  let fixture: ComponentFixture<RiskEventPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventPieChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
