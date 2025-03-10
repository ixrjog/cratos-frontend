import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSshKeyIdentityComponent } from './user-ssh-key-identity.component';

describe('UserSshKeyIdentityComponent', () => {
  let component: UserSshKeyIdentityComponent;
  let fixture: ComponentFixture<UserSshKeyIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSshKeyIdentityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSshKeyIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
