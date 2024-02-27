import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacGroupDataTableComponent } from './rbac-group-data-table.component';

describe('RbacGroupDataTableComponent', () => {
  let component: RbacGroupDataTableComponent;
  let fixture: ComponentFixture<RbacGroupDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacGroupDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacGroupDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
