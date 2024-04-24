import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventImpactBarChartComponent } from './risk-event-impact-bar-chart.component';

describe('RiskEventImpactBarChartComponent', () => {
  let component: RiskEventImpactBarChartComponent;
  let fixture: ComponentFixture<RiskEventImpactBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventImpactBarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventImpactBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
