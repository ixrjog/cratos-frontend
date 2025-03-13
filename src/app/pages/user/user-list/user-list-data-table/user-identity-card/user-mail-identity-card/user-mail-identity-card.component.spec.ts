import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMailIdentityCardComponent } from './user-mail-identity-card.component';

describe('UserMailIdentityCardComponent', () => {
  let component: UserMailIdentityCardComponent;
  let fixture: ComponentFixture<UserMailIdentityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMailIdentityCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMailIdentityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
