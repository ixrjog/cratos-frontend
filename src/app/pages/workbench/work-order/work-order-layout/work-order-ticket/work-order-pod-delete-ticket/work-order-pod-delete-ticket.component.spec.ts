import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderPodDeleteTicketComponent } from './work-order-pod-delete-ticket.component';

describe('WorkOrderPodDeleteTicketComponent', () => {
  let component: WorkOrderPodDeleteTicketComponent;
  let fixture: ComponentFixture<WorkOrderPodDeleteTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderPodDeleteTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderPodDeleteTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
