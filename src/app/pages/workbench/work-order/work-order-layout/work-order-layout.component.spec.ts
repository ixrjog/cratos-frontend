import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderLayoutComponent } from './work-order-layout.component';

describe('WorkOrderLayoutComponent', () => {
  let component: WorkOrderLayoutComponent;
  let fixture: ComponentFixture<WorkOrderLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
