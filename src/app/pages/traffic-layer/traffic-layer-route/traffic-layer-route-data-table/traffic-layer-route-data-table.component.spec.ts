import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerRouteDataTableComponent } from './traffic-layer-route-data-table.component';

describe('TrafficLayerRouteDataTableComponent', () => {
  let component: TrafficLayerRouteDataTableComponent;
  let fixture: ComponentFixture<TrafficLayerRouteDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerRouteDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerRouteDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
