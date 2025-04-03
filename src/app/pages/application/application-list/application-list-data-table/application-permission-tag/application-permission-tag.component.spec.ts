import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPermissionTagComponent } from './application-permission-tag.component';

describe('ApplicationPermissionTagComponent', () => {
  let component: ApplicationPermissionTagComponent;
  let fixture: ComponentFixture<ApplicationPermissionTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationPermissionTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationPermissionTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
