import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinopsAppCostDetailComponent } from './finops-app-cost-detail.component';

describe('FinopsAppCostDetailComponent', () => {
  let component: FinopsAppCostDetailComponent;
  let fixture: ComponentFixture<FinopsAppCostDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinopsAppCostDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinopsAppCostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
