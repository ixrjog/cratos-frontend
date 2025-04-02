import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceCenterDataTableComponent } from './resource-center-data-table.component';

describe('ResourceCenterDataTableComponent', () => {
  let component: ResourceCenterDataTableComponent;
  let fixture: ComponentFixture<ResourceCenterDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceCenterDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceCenterDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
