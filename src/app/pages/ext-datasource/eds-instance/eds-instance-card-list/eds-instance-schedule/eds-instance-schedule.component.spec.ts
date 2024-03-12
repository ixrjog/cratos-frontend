import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsInstanceScheduleComponent } from './eds-instance-schedule.component';

describe('EdsInstanceScheduleComponent', () => {
  let component: EdsInstanceScheduleComponent;
  let fixture: ComponentFixture<EdsInstanceScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsInstanceScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsInstanceScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
