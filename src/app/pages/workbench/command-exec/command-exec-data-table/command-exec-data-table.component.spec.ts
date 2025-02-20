import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandExecDataTableComponent } from './command-exec-data-table.component';

describe('CommandExecDataTableComponent', () => {
  let component: CommandExecDataTableComponent;
  let fixture: ComponentFixture<CommandExecDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandExecDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandExecDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
