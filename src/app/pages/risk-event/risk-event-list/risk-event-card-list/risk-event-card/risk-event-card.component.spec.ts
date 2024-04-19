import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventCardComponent } from './risk-event-card.component';

describe('RiskEventCardComponent', () => {
  let component: RiskEventCardComponent;
  let fixture: ComponentFixture<RiskEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
