import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLayerRouteEditorComponent } from './traffic-layer-route-editor.component';

describe('TrafficLayerRouteEditorComponent', () => {
  let component: TrafficLayerRouteEditorComponent;
  let fixture: ComponentFixture<TrafficLayerRouteEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficLayerRouteEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLayerRouteEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
