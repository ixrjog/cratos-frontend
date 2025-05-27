import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAliyunRamResetTicketComponent } from './work-order-aliyun-ram-reset-ticket.component';

describe('WorkOrderAliyunRamResetTicketComponent', () => {
  let component: WorkOrderAliyunRamResetTicketComponent;
  let fixture: ComponentFixture<WorkOrderAliyunRamResetTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAliyunRamResetTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAliyunRamResetTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
