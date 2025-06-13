import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAliyunOnsTopicTicketComponent } from './work-order-aliyun-ons-topic-ticket.component';

describe('WorkOrderAliyunOnsTopicTicketComponent', () => {
  let component: WorkOrderAliyunOnsTopicTicketComponent;
  let fixture: ComponentFixture<WorkOrderAliyunOnsTopicTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAliyunOnsTopicTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAliyunOnsTopicTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
