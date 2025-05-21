import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderCloudPolicyTicketComponent } from './work-order-cloud-policy-ticket.component';

describe('WorkOrderCloudPolicyTicketComponent', () => {
  let component: WorkOrderCloudPolicyTicketComponent;
  let fixture: ComponentFixture<WorkOrderCloudPolicyTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderCloudPolicyTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderCloudPolicyTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
