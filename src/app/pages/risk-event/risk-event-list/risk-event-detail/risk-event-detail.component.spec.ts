import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventDetailComponent } from './risk-event-detail.component';

describe('RiskEventDetailComponent', () => {
  let component: RiskEventDetailComponent;
  let fixture: ComponentFixture<RiskEventDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
