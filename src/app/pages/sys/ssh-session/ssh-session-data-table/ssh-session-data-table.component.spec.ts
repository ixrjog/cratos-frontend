import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SshSessionDataTableComponent } from './ssh-session-data-table.component';

describe('SshSessionDataTableComponent', () => {
  let component: SshSessionDataTableComponent;
  let fixture: ComponentFixture<SshSessionDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SshSessionDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SshSessionDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
