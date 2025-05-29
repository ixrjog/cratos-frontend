import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAwsIamResetTicketComponent } from './work-order-aws-iam-reset-ticket.component';

describe('WorkOrderAwsIamResetTicketComponent', () => {
  let component: WorkOrderAwsIamResetTicketComponent;
  let fixture: ComponentFixture<WorkOrderAwsIamResetTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAwsIamResetTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAwsIamResetTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
