import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerIngressServiceComponent } from './traffic-layer-ingress-service.component';

describe('TrafficLayerIngressServiceComponent', () => {
  let component: TrafficLayerIngressServiceComponent;
  let fixture: ComponentFixture<TrafficLayerIngressServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerIngressServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerIngressServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
