import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderApplicationRedeployTicketComponent } from './work-order-application-redeploy-ticket.component';

describe('WorkOrderApplicationRedeployTicketComponent', () => {
  let component: WorkOrderApplicationRedeployTicketComponent;
  let fixture: ComponentFixture<WorkOrderApplicationRedeployTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderApplicationRedeployTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderApplicationRedeployTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
