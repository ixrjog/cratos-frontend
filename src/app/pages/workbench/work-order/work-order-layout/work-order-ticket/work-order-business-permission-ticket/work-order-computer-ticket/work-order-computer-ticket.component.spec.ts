import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderComputerTicketComponent } from './work-order-computer-ticket.component';

describe('WorkOrderComputerTicketComponent', () => {
  let component: WorkOrderComputerTicketComponent;
  let fixture: ComponentFixture<WorkOrderComputerTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderComputerTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderComputerTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
