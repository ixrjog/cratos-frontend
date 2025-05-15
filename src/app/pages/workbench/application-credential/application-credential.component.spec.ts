import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationCredentialComponent } from './application-credential.component';

describe('ApplicationCredentialComponent', () => {
  let component: ApplicationCredentialComponent;
  let fixture: ComponentFixture<ApplicationCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationCredentialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
