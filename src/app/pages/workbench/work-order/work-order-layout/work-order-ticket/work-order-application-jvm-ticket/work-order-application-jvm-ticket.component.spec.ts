import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderApplicationJvmTicketComponent } from './work-order-application-jvm-ticket.component';

describe('WorkOrderApplicationJvmTicketComponent', () => {
  let component: WorkOrderApplicationJvmTicketComponent;
  let fixture: ComponentFixture<WorkOrderApplicationJvmTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderApplicationJvmTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderApplicationJvmTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
