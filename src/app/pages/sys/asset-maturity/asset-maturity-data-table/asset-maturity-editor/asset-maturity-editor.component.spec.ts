import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaturityEditorComponent } from './asset-maturity-editor.component';

describe('AssetMaturityEditorComponent', () => {
  let component: AssetMaturityEditorComponent;
  let fixture: ComponentFixture<AssetMaturityEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaturityEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetMaturityEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
