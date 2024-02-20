import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTagsComponent } from './business-tags.component';

describe('BusinessTagsComponent', () => {
  let component: BusinessTagsComponent;
  let fixture: ComponentFixture<BusinessTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessTagsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
