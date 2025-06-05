import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAwsIamPolicyTicketComponent } from './work-order-aws-iam-policy-ticket.component';

describe('WorkOrderAwsIamPolicyTicketComponent', () => {
  let component: WorkOrderAwsIamPolicyTicketComponent;
  let fixture: ComponentFixture<WorkOrderAwsIamPolicyTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAwsIamPolicyTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAwsIamPolicyTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
