import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAliyunKmsSecretTicketComponent } from './work-order-aliyun-kms-secret-ticket.component';

describe('WorkOrderAliyunKmsSecretTicketComponent', () => {
  let component: WorkOrderAliyunKmsSecretTicketComponent;
  let fixture: ComponentFixture<WorkOrderAliyunKmsSecretTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAliyunKmsSecretTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAliyunKmsSecretTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
