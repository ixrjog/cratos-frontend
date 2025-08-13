import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebTerminalComponent } from './web-terminal.component';

describe('WebTerminalComponent', () => {
  let component: WebTerminalComponent;
  let fixture: ComponentFixture<WebTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebTerminalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
