import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacRoleEditorComponent } from './rbac-role-editor.component';

describe('RbacRoleEditorComponent', () => {
  let component: RbacRoleEditorComponent;
  let fixture: ComponentFixture<RbacRoleEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacRoleEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacRoleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
