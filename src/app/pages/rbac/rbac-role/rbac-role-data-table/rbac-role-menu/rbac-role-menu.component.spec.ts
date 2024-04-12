import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacRoleMenuComponent } from './rbac-role-menu.component';

describe('RbacRoleMenuComponent', () => {
  let component: RbacRoleMenuComponent;
  let fixture: ComponentFixture<RbacRoleMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacRoleMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacRoleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
