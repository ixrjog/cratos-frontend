import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRobotSettingsComponent } from './user-robot-settings.component';

describe('UserRobotSettingsComponent', () => {
  let component: UserRobotSettingsComponent;
  let fixture: ComponentFixture<UserRobotSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRobotSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRobotSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
