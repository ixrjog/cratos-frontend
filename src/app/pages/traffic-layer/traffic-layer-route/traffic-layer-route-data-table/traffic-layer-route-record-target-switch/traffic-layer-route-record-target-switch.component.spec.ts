import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerRouteRecordTargetSwitchComponent } from './traffic-layer-route-record-target-switch.component';

describe('TrafficLayerRouteRecordTargetSwitchComponent', () => {
  let component: TrafficLayerRouteRecordTargetSwitchComponent;
  let fixture: ComponentFixture<TrafficLayerRouteRecordTargetSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerRouteRecordTargetSwitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerRouteRecordTargetSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
