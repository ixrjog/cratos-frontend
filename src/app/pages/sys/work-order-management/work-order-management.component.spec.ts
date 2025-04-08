import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderManagementComponent } from './work-order-management.component';

describe('WorkOrderManagementComponent', () => {
  let component: WorkOrderManagementComponent;
  let fixture: ComponentFixture<WorkOrderManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
