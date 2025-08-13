import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebTerminalDrawerComponent } from './web-terminal-drawer.component';

describe('WebTerminalDrawerComponent', () => {
  let component: WebTerminalDrawerComponent;
  let fixture: ComponentFixture<WebTerminalDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebTerminalDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebTerminalDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
