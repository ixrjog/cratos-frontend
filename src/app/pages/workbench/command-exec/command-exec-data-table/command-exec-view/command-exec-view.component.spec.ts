import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandExecViewComponent } from './command-exec-view.component';

describe('CommandExecViewComponent', () => {
  let component: CommandExecViewComponent;
  let fixture: ComponentFixture<CommandExecViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandExecViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandExecViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
