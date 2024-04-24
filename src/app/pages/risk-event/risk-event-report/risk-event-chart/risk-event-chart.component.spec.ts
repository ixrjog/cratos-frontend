import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventChartComponent } from './risk-event-chart.component';

describe('RiskEventChartComponent', () => {
  let component: RiskEventChartComponent;
  let fixture: ComponentFixture<RiskEventChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
