import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSshKeySettingsComponent } from './user-ssh-key-settings.component';

describe('UserSshKeySettingsComponent', () => {
  let component: UserSshKeySettingsComponent;
  let fixture: ComponentFixture<UserSshKeySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSshKeySettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSshKeySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
