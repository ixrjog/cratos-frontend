import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventCardListComponent } from './risk-event-card-list.component';

describe('RiskEventCardListComponent', () => {
  let component: RiskEventCardListComponent;
  let fixture: ComponentFixture<RiskEventCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventCardListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
