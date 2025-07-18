import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderReportManagementComponent } from './work-order-report-management.component';

describe('WorkOrderReportManagementComponent', () => {
  let component: WorkOrderReportManagementComponent;
  let fixture: ComponentFixture<WorkOrderReportManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderReportManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderReportManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
