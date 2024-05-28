import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SshSessionComponent } from './ssh-session.component';

describe('SshSessionComponent', () => {
  let component: SshSessionComponent;
  let fixture: ComponentFixture<SshSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SshSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SshSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
