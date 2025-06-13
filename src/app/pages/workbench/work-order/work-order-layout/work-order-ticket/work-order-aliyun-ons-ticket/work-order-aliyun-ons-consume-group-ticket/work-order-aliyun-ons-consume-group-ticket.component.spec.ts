import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAliyunOnsConsumeGroupTicketComponent } from './work-order-aliyun-ons-consume-group-ticket.component';

describe('WorkOrderAliyunOnsConsumeGroupTicketComponent', () => {
  let component: WorkOrderAliyunOnsConsumeGroupTicketComponent;
  let fixture: ComponentFixture<WorkOrderAliyunOnsConsumeGroupTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAliyunOnsConsumeGroupTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAliyunOnsConsumeGroupTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
