import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLdapIdentityCardComponent } from './user-ldap-identity-card.component';

describe('UserLdapIdentityCardComponent', () => {
  let component: UserLdapIdentityCardComponent;
  let fixture: ComponentFixture<UserLdapIdentityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLdapIdentityCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLdapIdentityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
