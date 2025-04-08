import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderManagementDataTableComponent } from './work-order-management-data-table.component';

describe('WorkOrderManagementDataTableComponent', () => {
  let component: WorkOrderManagementDataTableComponent;
  let fixture: ComponentFixture<WorkOrderManagementDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderManagementDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderManagementDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
