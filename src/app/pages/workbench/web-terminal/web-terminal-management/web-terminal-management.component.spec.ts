import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebTerminalManagementComponent } from './web-terminal-management.component';

describe('WebTerminalManagementComponent', () => {
  let component: WebTerminalManagementComponent;
  let fixture: ComponentFixture<WebTerminalManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebTerminalManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebTerminalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
