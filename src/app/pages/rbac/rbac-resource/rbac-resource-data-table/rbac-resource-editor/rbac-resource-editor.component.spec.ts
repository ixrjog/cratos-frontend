import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacResourceEditorComponent } from './rbac-resource-editor.component';

describe('RbacResourceEditorComponent', () => {
  let component: RbacResourceEditorComponent;
  let fixture: ComponentFixture<RbacResourceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacResourceEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacResourceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
