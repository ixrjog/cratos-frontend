import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderApplicationTicketComponent } from './work-order-application-ticket.component';

describe('WorkOrderApplicationTicketComponent', () => {
  let component: WorkOrderApplicationTicketComponent;
  let fixture: ComponentFixture<WorkOrderApplicationTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderApplicationTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderApplicationTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
