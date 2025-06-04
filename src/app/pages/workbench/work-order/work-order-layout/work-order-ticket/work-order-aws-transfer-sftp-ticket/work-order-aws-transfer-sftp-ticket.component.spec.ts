import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAwsTransferSftpTicketComponent } from './work-order-aws-transfer-sftp-ticket.component';

describe('WorkOrderAwsTransferSftpTicketComponent', () => {
  let component: WorkOrderAwsTransferSftpTicketComponent;
  let fixture: ComponentFixture<WorkOrderAwsTransferSftpTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAwsTransferSftpTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderAwsTransferSftpTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
