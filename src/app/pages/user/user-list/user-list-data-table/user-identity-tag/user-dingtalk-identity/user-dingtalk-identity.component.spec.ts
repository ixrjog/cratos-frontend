import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDingtalkIdentityComponent } from './user-dingtalk-identity.component';

describe('UserDingtalkIdentityComponent', () => {
  let component: UserDingtalkIdentityComponent;
  let fixture: ComponentFixture<UserDingtalkIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDingtalkIdentityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDingtalkIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
