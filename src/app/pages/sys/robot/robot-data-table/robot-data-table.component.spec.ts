import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotDataTableComponent } from './robot-data-table.component';

describe('RobotDataTableComponent', () => {
  let component: RobotDataTableComponent;
  let fixture: ComponentFixture<RobotDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
