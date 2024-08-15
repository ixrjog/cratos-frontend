import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerIngressDetailComponent } from './traffic-layer-ingress-detail.component';

describe('TrafficLayerIngressDetailComponent', () => {
  let component: TrafficLayerIngressDetailComponent;
  let fixture: ComponentFixture<TrafficLayerIngressDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerIngressDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerIngressDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
