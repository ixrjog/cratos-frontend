import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerIngressServiceDetailComponent } from './traffic-layer-ingress-service-detail.component';

describe('TrafficLayerIngressServiceDetailComponent', () => {
  let component: TrafficLayerIngressServiceDetailComponent;
  let fixture: ComponentFixture<TrafficLayerIngressServiceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerIngressServiceDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerIngressServiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
