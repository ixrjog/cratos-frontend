import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebTerminalItemComponent } from './web-terminal-item.component';

describe('WebTerminalItemComponent', () => {
  let component: WebTerminalItemComponent;
  let fixture: ComponentFixture<WebTerminalItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebTerminalItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebTerminalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
