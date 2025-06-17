import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinopsAppCostComponent } from './finops-app-cost.component';

describe('FinopsAppCostComponent', () => {
  let component: FinopsAppCostComponent;
  let fixture: ComponentFixture<FinopsAppCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinopsAppCostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinopsAppCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
