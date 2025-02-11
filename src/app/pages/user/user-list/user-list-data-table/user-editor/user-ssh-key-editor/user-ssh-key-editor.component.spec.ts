import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSshKeyEditorComponent } from './user-ssh-key-editor.component';

describe('UserSshKeyEditorComponent', () => {
  let component: UserSshKeyEditorComponent;
  let fixture: ComponentFixture<UserSshKeyEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSshKeyEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSshKeyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
