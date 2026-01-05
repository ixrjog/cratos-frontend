import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordSettingsComponent } from './user-password-settings.component';

describe('UserPasswordSettingsComponent', () => {
  let component: UserPasswordSettingsComponent;
  let fixture: ComponentFixture<UserPasswordSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPasswordSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPasswordSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
