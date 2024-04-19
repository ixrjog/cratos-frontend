import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventImpactComponent } from './risk-event-impact.component';

describe('RiskEventImpactComponent', () => {
  let component: RiskEventImpactComponent;
  let fixture: ComponentFixture<RiskEventImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventImpactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
