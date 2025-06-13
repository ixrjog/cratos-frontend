import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderApplicationTestTicketComponent } from './work-order-application-test-ticket.component';

describe('WorkOrderApplicationTestTicketComponent', () => {
  let component: WorkOrderApplicationTestTicketComponent;
  let fixture: ComponentFixture<WorkOrderApplicationTestTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderApplicationTestTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderApplicationTestTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
