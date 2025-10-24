import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsAssetBatchImportComponent } from './eds-asset-batch-import.component';

describe('EdsAssetBatchImportComponent', () => {
  let component: EdsAssetBatchImportComponent;
  let fixture: ComponentFixture<EdsAssetBatchImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsAssetBatchImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsAssetBatchImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
