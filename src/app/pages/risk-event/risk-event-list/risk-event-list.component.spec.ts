import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskEventListComponent } from './risk-event-list.component';

describe('RiskEventListComponent', () => {
  let component: RiskEventListComponent;
  let fixture: ComponentFixture<RiskEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskEventListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
