import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaturityComponent } from './asset-maturity.component';

describe('AssetMaturityComponent', () => {
  let component: AssetMaturityComponent;
  let fixture: ComponentFixture<AssetMaturityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaturityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetMaturityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
