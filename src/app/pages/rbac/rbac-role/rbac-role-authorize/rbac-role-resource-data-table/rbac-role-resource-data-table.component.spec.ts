import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacRoleResourceDataTableComponent } from './rbac-role-resource-data-table.component';

describe('RbacRoleResourceDataTableComponent', () => {
  let component: RbacRoleResourceDataTableComponent;
  let fixture: ComponentFixture<RbacRoleResourceDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacRoleResourceDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacRoleResourceDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
