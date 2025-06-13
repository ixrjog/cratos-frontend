import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAliyunOnsTicketComponent } from './work-order-aliyun-ons-ticket.component';

describe('WorkOrderAliyunOnsTicketComponent', () => {
  let component: WorkOrderAliyunOnsTicketComponent;
  let fixture: ComponentFixture<WorkOrderAliyunOnsTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAliyunOnsTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAliyunOnsTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
