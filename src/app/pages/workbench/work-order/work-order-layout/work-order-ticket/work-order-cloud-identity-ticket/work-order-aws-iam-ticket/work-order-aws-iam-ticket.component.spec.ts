import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAwsIamTicketComponent } from './work-order-aws-iam-ticket.component';

describe('WorkOrderAwsIamTicketComponent', () => {
  let component: WorkOrderAwsIamTicketComponent;
  let fixture: ComponentFixture<WorkOrderAwsIamTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAwsIamTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAwsIamTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
