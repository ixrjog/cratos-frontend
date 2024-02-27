import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacResourceDataTableComponent } from './rbac-resource-data-table.component';

describe('RbacResourceDataTableComponent', () => {
  let component: RbacResourceDataTableComponent;
  let fixture: ComponentFixture<RbacResourceDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacResourceDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacResourceDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
