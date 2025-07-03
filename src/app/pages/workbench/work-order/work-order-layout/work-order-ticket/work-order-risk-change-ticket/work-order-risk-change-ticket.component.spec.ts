import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderRiskChangeTicketComponent } from './work-order-risk-change-ticket.component';

describe('WorkOrderRiskChangeTicketComponent', () => {
  let component: WorkOrderRiskChangeTicketComponent;
  let fixture: ComponentFixture<WorkOrderRiskChangeTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderRiskChangeTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderRiskChangeTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
