import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsAssetManualEditorComponent } from './eds-asset-manual-editor.component';

describe('EdsAssetManualEditorComponent', () => {
  let component: EdsAssetManualEditorComponent;
  let fixture: ComponentFixture<EdsAssetManualEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsAssetManualEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsAssetManualEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
