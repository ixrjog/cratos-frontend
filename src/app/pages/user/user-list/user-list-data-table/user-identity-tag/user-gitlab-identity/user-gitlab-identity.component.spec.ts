import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGitlabIdentityComponent } from './user-gitlab-identity.component';

describe('UserGitlabIdentityComponent', () => {
  let component: UserGitlabIdentityComponent;
  let fixture: ComponentFixture<UserGitlabIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGitlabIdentityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGitlabIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
