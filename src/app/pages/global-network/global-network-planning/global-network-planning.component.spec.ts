import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkPlanningComponent } from './global-network-planning.component';

describe('GlobalNetworkPlanningComponent', () => {
  let component: GlobalNetworkPlanningComponent;
  let fixture: ComponentFixture<GlobalNetworkPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkPlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
