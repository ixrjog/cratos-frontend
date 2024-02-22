import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelNetworkEditorComponent } from './channel-network-editor.component';

describe('ChannelNetworkEditorComponent', () => {
  let component: ChannelNetworkEditorComponent;
  let fixture: ComponentFixture<ChannelNetworkEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelNetworkEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelNetworkEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
