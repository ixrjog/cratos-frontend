import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainListDataTableComponent } from './domain-list-data-table.component';

describe('DomainListDataTableComponent', () => {
  let component: DomainListDataTableComponent;
  let fixture: ComponentFixture<DomainListDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainListDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainListDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
