import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderManagementEditorComponent } from './work-order-management-editor.component';

describe('WorkOrderManagementEditorComponent', () => {
  let component: WorkOrderManagementEditorComponent;
  let fixture: ComponentFixture<WorkOrderManagementEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderManagementEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderManagementEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
