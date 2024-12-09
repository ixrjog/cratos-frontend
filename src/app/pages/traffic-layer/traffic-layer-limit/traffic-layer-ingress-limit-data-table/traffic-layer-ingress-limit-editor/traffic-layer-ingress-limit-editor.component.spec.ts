import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerIngressLimitEditorComponent } from './traffic-layer-ingress-limit-editor.component';

describe('TrafficLayerIngressLimitEditorComponent', () => {
  let component: TrafficLayerIngressLimitEditorComponent;
  let fixture: ComponentFixture<TrafficLayerIngressLimitEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerIngressLimitEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerIngressLimitEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
