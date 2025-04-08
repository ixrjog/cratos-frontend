import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTicketManagementDataTableComponent } from './work-order-ticket-management-data-table.component';

describe('WorkOrderTicketManagementDataTableComponent', () => {
  let component: WorkOrderTicketManagementDataTableComponent;
  let fixture: ComponentFixture<WorkOrderTicketManagementDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderTicketManagementDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderTicketManagementDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
