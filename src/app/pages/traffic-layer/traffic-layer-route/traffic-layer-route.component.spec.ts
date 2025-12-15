import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerRouteComponent } from './traffic-layer-route.component';

describe('TrafficLayerRouteComponent', () => {
  let component: TrafficLayerRouteComponent;
  let fixture: ComponentFixture<TrafficLayerRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerRouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
