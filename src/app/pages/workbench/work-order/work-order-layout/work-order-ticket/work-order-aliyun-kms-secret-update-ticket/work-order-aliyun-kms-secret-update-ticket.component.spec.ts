import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAliyunKmsSecretUpdateTicketComponent } from './work-order-aliyun-kms-secret-update-ticket.component';

describe('WorkOrderAliyunKmsSecretUpdateTicketComponent', () => {
  let component: WorkOrderAliyunKmsSecretUpdateTicketComponent;
  let fixture: ComponentFixture<WorkOrderAliyunKmsSecretUpdateTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAliyunKmsSecretUpdateTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAliyunKmsSecretUpdateTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
