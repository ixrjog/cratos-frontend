import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderApprovalProcessComponent } from './work-order-approval-process.component';

describe('WorkOrderApprovalProcessComponent', () => {
  let component: WorkOrderApprovalProcessComponent;
  let fixture: ComponentFixture<WorkOrderApprovalProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderApprovalProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderApprovalProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
