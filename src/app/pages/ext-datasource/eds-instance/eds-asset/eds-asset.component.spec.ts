import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsAssetComponent } from './eds-asset.component';

describe('EdsAssetComponent', () => {
  let component: EdsAssetComponent;
  let fixture: ComponentFixture<EdsAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsAssetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
