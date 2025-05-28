import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderMailIdentityResetTicketComponent } from './work-order-mail-identity-reset-ticket.component';

describe('WorkOrderMailIdentityResetTicketComponent', () => {
  let component: WorkOrderMailIdentityResetTicketComponent;
  let fixture: ComponentFixture<WorkOrderMailIdentityResetTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderMailIdentityResetTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderMailIdentityResetTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
