import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderMonthReportComponent } from './work-order-month-report.component';

describe('WorkOrderMonthReportComponent', () => {
  let component: WorkOrderMonthReportComponent;
  let fixture: ComponentFixture<WorkOrderMonthReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderMonthReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderMonthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
