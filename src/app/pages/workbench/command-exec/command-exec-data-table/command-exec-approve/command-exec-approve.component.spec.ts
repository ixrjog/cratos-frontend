import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandExecApproveComponent } from './command-exec-approve.component';

describe('CommandExecApproveComponent', () => {
  let component: CommandExecApproveComponent;
  let fixture: ComponentFixture<CommandExecApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandExecApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandExecApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
