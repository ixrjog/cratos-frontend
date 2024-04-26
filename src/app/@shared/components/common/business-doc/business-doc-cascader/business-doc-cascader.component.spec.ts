import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDocCascaderComponent } from './business-doc-cascader.component';

describe('BusinessDocCascaderComponent', () => {
  let component: BusinessDocCascaderComponent;
  let fixture: ComponentFixture<BusinessDocCascaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessDocCascaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessDocCascaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
