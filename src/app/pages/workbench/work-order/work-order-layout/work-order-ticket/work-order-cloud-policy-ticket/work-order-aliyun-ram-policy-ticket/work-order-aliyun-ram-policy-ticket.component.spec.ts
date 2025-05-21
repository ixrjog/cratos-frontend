import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAliyunRamPolicyTicketComponent } from './work-order-aliyun-ram-policy-ticket.component';

describe('WorkOrderAliyunRamPolicyTicketComponent', () => {
  let component: WorkOrderAliyunRamPolicyTicketComponent;
  let fixture: ComponentFixture<WorkOrderAliyunRamPolicyTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAliyunRamPolicyTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAliyunRamPolicyTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
