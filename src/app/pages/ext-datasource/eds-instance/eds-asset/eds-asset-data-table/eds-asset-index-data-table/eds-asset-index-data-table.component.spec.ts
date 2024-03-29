import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsAssetIndexDataTableComponent } from './eds-asset-index-data-table.component';

describe('EdsAssetIndexDataTableComponent', () => {
  let component: EdsAssetIndexDataTableComponent;
  let fixture: ComponentFixture<EdsAssetIndexDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsAssetIndexDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsAssetIndexDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
