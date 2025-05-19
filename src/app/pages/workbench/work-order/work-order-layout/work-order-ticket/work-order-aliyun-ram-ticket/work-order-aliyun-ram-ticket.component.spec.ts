import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAliyunRamTicketComponent } from './work-order-aliyun-ram-ticket.component';

describe('WorkOrderAliyunRamTicketComponent', () => {
  let component: WorkOrderAliyunRamTicketComponent;
  let fixture: ComponentFixture<WorkOrderAliyunRamTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAliyunRamTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAliyunRamTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
