import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDingtalkIdentityCardComponent } from './user-dingtalk-identity-card.component';

describe('UserDingtalkIdentityCardComponent', () => {
  let component: UserDingtalkIdentityCardComponent;
  let fixture: ComponentFixture<UserDingtalkIdentityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDingtalkIdentityCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDingtalkIdentityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
