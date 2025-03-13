import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGitlabIdentityCardComponent } from './user-gitlab-identity-card.component';

describe('UserGitlabIdentityCardComponent', () => {
  let component: UserGitlabIdentityCardComponent;
  let fixture: ComponentFixture<UserGitlabIdentityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGitlabIdentityCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGitlabIdentityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
