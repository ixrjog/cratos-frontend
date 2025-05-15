import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationCredentialDataTableComponent } from './application-credential-data-table.component';

describe('ApplicationCredentialDataTableComponent', () => {
  let component: ApplicationCredentialDataTableComponent;
  let fixture: ComponentFixture<ApplicationCredentialDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationCredentialDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationCredentialDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
