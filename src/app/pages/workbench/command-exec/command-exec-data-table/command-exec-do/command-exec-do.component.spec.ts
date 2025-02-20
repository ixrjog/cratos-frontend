import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandExecDoComponent } from './command-exec-do.component';

describe('CommandExecDoComponent', () => {
  let component: CommandExecDoComponent;
  let fixture: ComponentFixture<CommandExecDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandExecDoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandExecDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
