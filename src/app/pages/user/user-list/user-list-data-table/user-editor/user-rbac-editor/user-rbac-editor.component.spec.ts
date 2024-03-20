import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRbacEditorComponent } from './user-rbac-editor.component';

describe('UserRbacEditorComponent', () => {
  let component: UserRbacEditorComponent;
  let fixture: ComponentFixture<UserRbacEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRbacEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRbacEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
