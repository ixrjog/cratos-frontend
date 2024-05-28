import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XtermLogsComponent } from './xterm-logs.component';

describe('XtermComponent', () => {
  let component: XtermLogsComponent;
  let fixture: ComponentFixture<XtermLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XtermLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XtermLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
