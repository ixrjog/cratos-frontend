import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsAssetSshTerminalComponent } from './eds-asset-ssh-terminal.component';

describe('EdsAssetSshTerminalComponent', () => {
  let component: EdsAssetSshTerminalComponent;
  let fixture: ComponentFixture<EdsAssetSshTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsAssetSshTerminalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsAssetSshTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
