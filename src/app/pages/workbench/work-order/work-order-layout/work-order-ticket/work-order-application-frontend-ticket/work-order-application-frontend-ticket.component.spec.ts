import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderApplicationFrontendTicketComponent } from './work-order-application-frontend-ticket.component';

describe('WorkOrderApplicationFrontendTicketComponent', () => {
  let component: WorkOrderApplicationFrontendTicketComponent;
  let fixture: ComponentFixture<WorkOrderApplicationFrontendTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderApplicationFrontendTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderApplicationFrontendTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
