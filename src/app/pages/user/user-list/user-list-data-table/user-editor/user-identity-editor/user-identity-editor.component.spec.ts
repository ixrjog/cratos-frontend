import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIdentityEditorComponent } from './user-identity-editor.component';

describe('UserIdentityEditorComponent', () => {
  let component: UserIdentityEditorComponent;
  let fixture: ComponentFixture<UserIdentityEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserIdentityEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserIdentityEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
