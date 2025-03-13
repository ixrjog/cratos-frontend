import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionsSettingsComponent } from './user-permissions-settings.component';

describe('UserPermissionsSettingsComponent', () => {
  let component: UserPermissionsSettingsComponent;
  let fixture: ComponentFixture<UserPermissionsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPermissionsSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPermissionsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
