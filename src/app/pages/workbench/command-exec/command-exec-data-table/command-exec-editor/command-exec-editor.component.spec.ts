import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandExecEditorComponent } from './command-exec-editor.component';

describe('CommandExecEditorComponent', () => {
  let component: CommandExecEditorComponent;
  let fixture: ComponentFixture<CommandExecEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandExecEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandExecEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
