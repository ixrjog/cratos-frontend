import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacRoleDataTableComponent } from './rbac-role-data-table.component';

describe('RbacRoleDataTableComponent', () => {
  let component: RbacRoleDataTableComponent;
  let fixture: ComponentFixture<RbacRoleDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacRoleDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacRoleDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
