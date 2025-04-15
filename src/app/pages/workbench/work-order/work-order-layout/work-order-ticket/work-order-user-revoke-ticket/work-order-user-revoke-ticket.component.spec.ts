import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderUserRevokeTicketComponent } from './work-order-user-revoke-ticket.component';

describe('WorkOrderUserRevokeTicketComponent', () => {
  let component: WorkOrderUserRevokeTicketComponent;
  let fixture: ComponentFixture<WorkOrderUserRevokeTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderUserRevokeTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderUserRevokeTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
