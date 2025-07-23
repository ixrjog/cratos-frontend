import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderUserPasswordResetTicketComponent } from './work-order-user-password-reset-ticket.component';

describe('WorkOrderUserPasswordResetTicketComponent', () => {
  let component: WorkOrderUserPasswordResetTicketComponent;
  let fixture: ComponentFixture<WorkOrderUserPasswordResetTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderUserPasswordResetTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderUserPasswordResetTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
