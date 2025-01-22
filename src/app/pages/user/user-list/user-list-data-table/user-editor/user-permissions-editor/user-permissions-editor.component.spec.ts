import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionsEditorComponent } from './user-permissions-editor.component';

describe('UserPermissionsEditorComponent', () => {
  let component: UserPermissionsEditorComponent;
  let fixture: ComponentFixture<UserPermissionsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPermissionsEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPermissionsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
