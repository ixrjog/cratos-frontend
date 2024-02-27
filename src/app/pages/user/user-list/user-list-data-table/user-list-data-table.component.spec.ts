import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListDataTableComponent } from './user-list-data-table.component';

describe('UserListDataTableComponent', () => {
  let component: UserListDataTableComponent;
  let fixture: ComponentFixture<UserListDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
