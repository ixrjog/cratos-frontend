import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerAccountDataTableComponent } from './server-account-data-table.component';

describe('ServerAccountDataTableComponent', () => {
  let component: ServerAccountDataTableComponent;
  let fixture: ComponentFixture<ServerAccountDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerAccountDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerAccountDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
