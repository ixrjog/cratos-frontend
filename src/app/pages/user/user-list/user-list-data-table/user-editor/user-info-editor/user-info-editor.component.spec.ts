import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoEditorComponent } from './user-info-editor.component';

describe('UserInfoEditorComponent', () => {
  let component: UserInfoEditorComponent;
  let fixture: ComponentFixture<UserInfoEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInfoEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInfoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
