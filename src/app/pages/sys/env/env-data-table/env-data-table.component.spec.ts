import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvDataTableComponent } from './env-data-table.component';

describe('EnvDataTableComponent', () => {
  let component: EnvDataTableComponent;
  let fixture: ComponentFixture<EnvDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
