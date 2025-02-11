import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTagBatchEditorComponent } from './business-tag-batch-editor.component';

describe('BusinessTagBatchEditorComponent', () => {
  let component: BusinessTagBatchEditorComponent;
  let fixture: ComponentFixture<BusinessTagBatchEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessTagBatchEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessTagBatchEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
