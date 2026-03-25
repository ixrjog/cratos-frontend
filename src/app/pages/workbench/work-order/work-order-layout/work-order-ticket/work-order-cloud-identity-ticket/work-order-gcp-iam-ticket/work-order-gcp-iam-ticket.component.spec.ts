import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderGcpIamTicketComponent } from './work-order-gcp-iam-ticket.component';

describe('WorkOrderGcpIamTicketComponent', () => {
  let component: WorkOrderGcpIamTicketComponent;
  let fixture: ComponentFixture<WorkOrderGcpIamTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderGcpIamTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderGcpIamTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
