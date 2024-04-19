import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventImpactEditorComponent } from './risk-event-impact-editor.component';

describe('RiskEventImpactEditorComponent', () => {
  let component: RiskEventImpactEditorComponent;
  let fixture: ComponentFixture<RiskEventImpactEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventImpactEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventImpactEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
