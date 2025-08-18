import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebTerminalThemeSettingsComponent } from './web-terminal-theme-settings.component';

describe('WebTerminalThemeSettingsComponent', () => {
  let component: WebTerminalThemeSettingsComponent;
  let fixture: ComponentFixture<WebTerminalThemeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebTerminalThemeSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebTerminalThemeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
