import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderLdapIdentityTicketComponent } from './work-order-ldap-identity-ticket.component';

describe('WorkOrderLdapIdentityTicketComponent', () => {
  let component: WorkOrderLdapIdentityTicketComponent;
  let fixture: ComponentFixture<WorkOrderLdapIdentityTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderLdapIdentityTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderLdapIdentityTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
