import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderGcpIamRoleTicketComponent } from './work-order-gcp-iam-role-ticket.component';

describe('WorkOrderGcpIamRoleTicketComponent', () => {
  let component: WorkOrderGcpIamRoleTicketComponent;
  let fixture: ComponentFixture<WorkOrderGcpIamRoleTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderGcpIamRoleTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderGcpIamRoleTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
