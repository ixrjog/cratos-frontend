import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIdentitySettingsComponent } from './user-identity-settings.component';

describe('UserIdentitySettingsComponent', () => {
  let component: UserIdentitySettingsComponent;
  let fixture: ComponentFixture<UserIdentitySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserIdentitySettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserIdentitySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
