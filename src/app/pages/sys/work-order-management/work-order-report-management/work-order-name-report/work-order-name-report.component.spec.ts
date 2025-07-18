import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderNameReportComponent } from './work-order-name-report.component';

describe('WorkOrderNameReportComponent', () => {
  let component: WorkOrderNameReportComponent;
  let fixture: ComponentFixture<WorkOrderNameReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderNameReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderNameReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
