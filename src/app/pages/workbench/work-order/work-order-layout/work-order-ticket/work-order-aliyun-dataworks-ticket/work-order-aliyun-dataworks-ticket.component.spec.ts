import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAliyunDataworksTicketComponent } from './work-order-aliyun-dataworks-ticket.component';

describe('WorkOrderAliyunDataworksTicketComponent', () => {
  let component: WorkOrderAliyunDataworksTicketComponent;
  let fixture: ComponentFixture<WorkOrderAliyunDataworksTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAliyunDataworksTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAliyunDataworksTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
