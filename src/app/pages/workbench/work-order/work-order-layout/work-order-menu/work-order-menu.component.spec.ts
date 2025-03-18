import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderMenuComponent } from './work-order-menu.component';

describe('WorkOrderMenuComponent', () => {
  let component: WorkOrderMenuComponent;
  let fixture: ComponentFixture<WorkOrderMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
