import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBaseSettingsComponent } from './user-base-settings.component';

describe('UserBaseSettingsComponent', () => {
  let component: UserBaseSettingsComponent;
  let fixture: ComponentFixture<UserBaseSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBaseSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBaseSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
