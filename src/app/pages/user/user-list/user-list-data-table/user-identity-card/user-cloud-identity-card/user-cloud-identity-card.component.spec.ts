import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCloudIdentityCardComponent } from './user-cloud-identity-card.component';

describe('UserCloudIdentityCardComponent', () => {
  let component: UserCloudIdentityCardComponent;
  let fixture: ComponentFixture<UserCloudIdentityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCloudIdentityCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCloudIdentityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
