import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderGroupManagementEditorComponent } from './work-order-group-management-editor.component';

describe('WorkOrderGroupManagementEditorComponent', () => {
  let component: WorkOrderGroupManagementEditorComponent;
  let fixture: ComponentFixture<WorkOrderGroupManagementEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderGroupManagementEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderGroupManagementEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
