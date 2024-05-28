import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SshSessionInstanceCommandComponent } from './ssh-session-instance-command.component';

describe('SshSessionInstanceCommandComponent', () => {
  let component: SshSessionInstanceCommandComponent;
  let fixture: ComponentFixture<SshSessionInstanceCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SshSessionInstanceCommandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SshSessionInstanceCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
