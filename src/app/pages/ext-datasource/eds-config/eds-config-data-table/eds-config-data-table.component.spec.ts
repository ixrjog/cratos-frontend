import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsConfigDataTableComponent } from './eds-config-data-table.component';

describe('EdsConfigDataTableComponent', () => {
  let component: EdsConfigDataTableComponent;
  let fixture: ComponentFixture<EdsConfigDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsConfigDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsConfigDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
