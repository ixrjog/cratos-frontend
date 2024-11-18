import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationListDataTableComponent } from './application-list-data-table.component';

describe('ApplicationListDataTableComponent', () => {
  let component: ApplicationListDataTableComponent;
  let fixture: ComponentFixture<ApplicationListDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationListDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationListDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
