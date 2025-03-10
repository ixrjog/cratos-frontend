import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLdapIdentityComponent } from './user-ldap-identity.component';

describe('UserLdapIdentityComponent', () => {
  let component: UserLdapIdentityComponent;
  let fixture: ComponentFixture<UserLdapIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLdapIdentityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLdapIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
