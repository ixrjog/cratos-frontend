import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderCloudIdentityResetTicketComponent } from './work-order-cloud-identity-reset-ticket.component';

describe('WorkOrderCloudIdentityResetTicketComponent', () => {
  let component: WorkOrderCloudIdentityResetTicketComponent;
  let fixture: ComponentFixture<WorkOrderCloudIdentityResetTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderCloudIdentityResetTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderCloudIdentityResetTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
