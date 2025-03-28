import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderBaseTicketComponent } from './work-order-base-ticket.component';

describe('WorkOrderBaseTicketComponent', () => {
  let component: WorkOrderBaseTicketComponent;
  let fixture: ComponentFixture<WorkOrderBaseTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderBaseTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderBaseTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
