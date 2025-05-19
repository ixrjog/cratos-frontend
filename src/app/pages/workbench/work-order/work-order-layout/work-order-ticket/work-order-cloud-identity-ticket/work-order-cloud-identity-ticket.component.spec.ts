import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderCloudIdentityTicketComponent } from './work-order-cloud-identity-ticket.component';

describe('WorkOrderCloudIdentityTicketComponent', () => {
  let component: WorkOrderCloudIdentityTicketComponent;
  let fixture: ComponentFixture<WorkOrderCloudIdentityTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderCloudIdentityTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderCloudIdentityTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
