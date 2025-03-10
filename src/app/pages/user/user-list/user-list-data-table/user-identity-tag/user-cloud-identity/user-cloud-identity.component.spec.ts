import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCloudIdentityComponent } from './user-cloud-identity.component';

describe('UserCloudIdentityComponent', () => {
  let component: UserCloudIdentityComponent;
  let fixture: ComponentFixture<UserCloudIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCloudIdentityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCloudIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
