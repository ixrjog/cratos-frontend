import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacRoleDetailsComponent } from './rbac-role-details.component';

describe('RbacRoleDetailsComponent', () => {
  let component: RbacRoleDetailsComponent;
  let fixture: ComponentFixture<RbacRoleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacRoleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacRoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
