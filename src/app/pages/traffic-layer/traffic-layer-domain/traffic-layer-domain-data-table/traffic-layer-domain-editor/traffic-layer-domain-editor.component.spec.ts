import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerDomainEditorComponent } from './traffic-layer-domain-editor.component';

describe('TrafficLayerDomainEditorComponent', () => {
  let component: TrafficLayerDomainEditorComponent;
  let fixture: ComponentFixture<TrafficLayerDomainEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerDomainEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerDomainEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
