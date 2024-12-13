import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPermissionsComponent } from './business-permissions.component';

describe('BusinessPermissionsComponent', () => {
  let component: BusinessPermissionsComponent;
  let fixture: ComponentFixture<BusinessPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessPermissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
