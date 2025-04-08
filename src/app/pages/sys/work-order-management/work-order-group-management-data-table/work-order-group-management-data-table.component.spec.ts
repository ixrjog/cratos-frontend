import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderGroupManagementDataTableComponent } from './work-order-group-management-data-table.component';

describe('WorkOrderGroupManagementDataTableComponent', () => {
  let component: WorkOrderGroupManagementDataTableComponent;
  let fixture: ComponentFixture<WorkOrderGroupManagementDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderGroupManagementDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderGroupManagementDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
