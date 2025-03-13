import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMailIdentityComponent } from './user-mail-identity.component';

describe('UserMailIdentityComponent', () => {
  let component: UserMailIdentityComponent;
  let fixture: ComponentFixture<UserMailIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMailIdentityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMailIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
