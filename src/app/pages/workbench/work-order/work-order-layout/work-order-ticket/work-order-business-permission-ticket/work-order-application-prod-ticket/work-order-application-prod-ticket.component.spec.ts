import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderApplicationProdTicketComponent } from './work-order-application-prod-ticket.component';

describe('WorkOrderApplicationProdTicketComponent', () => {
  let component: WorkOrderApplicationProdTicketComponent;
  let fixture: ComponentFixture<WorkOrderApplicationProdTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderApplicationProdTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderApplicationProdTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
