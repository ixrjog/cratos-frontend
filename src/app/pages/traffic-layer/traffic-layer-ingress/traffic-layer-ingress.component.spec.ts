import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerIngressComponent } from './traffic-layer-ingress.component';

describe('TrafficLayerIngressComponent', () => {
  let component: TrafficLayerIngressComponent;
  let fixture: ComponentFixture<TrafficLayerIngressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerIngressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerIngressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
