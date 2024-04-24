import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventReportComponent } from './risk-event-report.component';

describe('RiskEventReportComponent', () => {
  let component: RiskEventReportComponent;
  let fixture: ComponentFixture<RiskEventReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
