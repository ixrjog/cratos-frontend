import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCascaderComponent } from './business-cascader.component';

describe('BusinessDocCascaderComponent', () => {
  let component: BusinessCascaderComponent;
  let fixture: ComponentFixture<BusinessCascaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCascaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCascaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
