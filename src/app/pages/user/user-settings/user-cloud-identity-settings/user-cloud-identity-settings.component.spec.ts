import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCloudIdentitySettingsComponent } from './user-cloud-identity-settings.component';

describe('UserCloudIdentitySettingsComponent', () => {
  let component: UserCloudIdentitySettingsComponent;
  let fixture: ComponentFixture<UserCloudIdentitySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCloudIdentitySettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCloudIdentitySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
