import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderDataTableComponent } from './work-order-data-table.component';

describe('WorkOrderDataTableComponent', () => {
  let component: WorkOrderDataTableComponent;
  let fixture: ComponentFixture<WorkOrderDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
