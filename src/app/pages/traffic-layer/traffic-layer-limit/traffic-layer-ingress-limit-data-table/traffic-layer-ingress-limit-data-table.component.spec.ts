import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerIngressLimitDataTableComponent } from './traffic-layer-ingress-limit-data-table.component';

describe('TrafficLayerIngressLimitDataTableComponent', () => {
  let component: TrafficLayerIngressLimitDataTableComponent;
  let fixture: ComponentFixture<TrafficLayerIngressLimitDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerIngressLimitDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerIngressLimitDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
