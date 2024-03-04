import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsAssetDataTableComponent } from './eds-asset-data-table.component';

describe('EdsAssetDataTableComponent', () => {
  let component: EdsAssetDataTableComponent;
  let fixture: ComponentFixture<EdsAssetDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsAssetDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsAssetDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
