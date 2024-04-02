import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerDomainDataTableComponent } from './traffic-layer-domain-data-table.component';

describe('TrafficLayerDomainDataTableComponent', () => {
  let component: TrafficLayerDomainDataTableComponent;
  let fixture: ComponentFixture<TrafficLayerDomainDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerDomainDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerDomainDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
