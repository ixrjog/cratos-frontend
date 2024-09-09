import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkEditorComponent } from './global-network-editor.component';

describe('GlobalNetworkEditorComponent', () => {
  let component: GlobalNetworkEditorComponent;
  let fixture: ComponentFixture<GlobalNetworkEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
