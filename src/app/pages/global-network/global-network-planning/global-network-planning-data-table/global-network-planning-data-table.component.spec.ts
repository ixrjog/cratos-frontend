import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkPlanningDataTableComponent } from './global-network-planning-data-table.component';

describe('GlobalNetworkPlanningDataTableComponent', () => {
  let component: GlobalNetworkPlanningDataTableComponent;
  let fixture: ComponentFixture<GlobalNetworkPlanningDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkPlanningDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkPlanningDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
