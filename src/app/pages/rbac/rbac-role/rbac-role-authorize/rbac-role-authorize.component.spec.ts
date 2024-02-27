import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacRoleAuthorizeComponent } from './rbac-role-authorize.component';

describe('RbacRoleConfigComponent', () => {
  let component: RbacRoleAuthorizeComponent;
  let fixture: ComponentFixture<RbacRoleAuthorizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacRoleAuthorizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacRoleAuthorizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
