import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaturityDataTableComponent } from './asset-maturity-data-table.component';

describe('AssetMaturityDataTableComponent', () => {
  let component: AssetMaturityDataTableComponent;
  let fixture: ComponentFixture<AssetMaturityDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaturityDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetMaturityDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
