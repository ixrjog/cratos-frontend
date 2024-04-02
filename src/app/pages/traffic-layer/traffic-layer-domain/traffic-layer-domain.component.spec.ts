import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerDomainComponent } from './traffic-layer-domain.component';

describe('TrafficLayerDomainComponent', () => {
  let component: TrafficLayerDomainComponent;
  let fixture: ComponentFixture<TrafficLayerDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerDomainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
