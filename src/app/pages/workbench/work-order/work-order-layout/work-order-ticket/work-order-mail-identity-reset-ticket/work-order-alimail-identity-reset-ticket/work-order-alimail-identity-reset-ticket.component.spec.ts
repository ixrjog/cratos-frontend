import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAlimailIdentityResetTicketComponent } from './work-order-alimail-identity-reset-ticket.component';

describe('WorkOrderAlimailIdentityResetTicketComponent', () => {
  let component: WorkOrderAlimailIdentityResetTicketComponent;
  let fixture: ComponentFixture<WorkOrderAlimailIdentityResetTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAlimailIdentityResetTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAlimailIdentityResetTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
